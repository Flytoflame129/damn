const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();
const _ = db.command;

const SKILLS = ['编程入门', '绘画设计', '乐器声乐', '摄影摄像', '口语交流', '运动技能', '书法棋艺', '剪辑运营'];
const REGIONS = ['旌阳区', '经开区', '罗江区', '广汉市', '什邡市', '绵竹市', '中江县'];

exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext();
  const action = event.action;

  if (action === 'login') return login(OPENID);
  if (action === 'listMarket') return listMarket(event);
  if (action === 'createDemand') return createDemand(OPENID, event);
  if (action === 'saveTutorProfile') return saveTutorProfile(OPENID, event);
  if (action === 'submitVerification') return submitVerification(OPENID, event);
  if (action === 'applyDemand') return applyDemand(OPENID, event);
  if (action === 'listMessages') return listMessages(OPENID);
  if (action === 'sendMessage') return sendMessage(OPENID, event);

  throw new Error(`Unsupported action: ${action}`);
};

async function login(openid) {
  const users = db.collection('users');
  const found = await users.where({ _openid: openid }).limit(1).get();
  if (found.data.length) return { user: found.data[0] };

  const now = db.serverDate();
  const user = {
    role: 'learner',
    createdAt: now,
    updatedAt: now
  };
  const created = await users.add({ data: user });
  return { user: Object.assign({ _id: created._id, _openid: openid }, user) };
}

async function listMarket(event) {
  const skill = event.skill && event.skill !== '全部' ? event.skill : null;
  const tutorQuery = skill ? { verificationStatus: 'approved', skills: _.all([skill]) } : { verificationStatus: 'approved' };
  const demandQuery = skill ? { status: 'open', skill } : { status: 'open' };

  const [tutors, demands] = await Promise.all([
    db.collection('tutorProfiles').where(tutorQuery).orderBy('updatedAt', 'desc').limit(50).get(),
    db.collection('demands').where(demandQuery).orderBy('createdAt', 'desc').limit(50).get()
  ]);

  return { tutors: tutors.data, demands: demands.data };
}

async function createDemand(openid, event) {
  const demand = normalizeDemand(event);
  const errors = validateDemand(demand);
  if (errors.length) throw new Error(errors[0]);

  const created = await db.collection('demands').add({
    data: Object.assign(demand, {
      ownerOpenid: openid,
      status: 'open',
      createdAt: db.serverDate(),
      updatedAt: db.serverDate()
    })
  });

  return { demandId: created._id };
}

async function saveTutorProfile(openid, event) {
  const profile = normalizeTutorProfile(event);
  const errors = validateTutorProfile(profile);
  if (errors.length) throw new Error(errors[0]);

  const collection = db.collection('tutorProfiles');
  const found = await collection.where({ _openid: openid }).limit(1).get();
  const data = Object.assign(profile, {
    verificationStatus: found.data[0] && found.data[0].verificationStatus === 'approved' ? 'approved' : 'pending',
    updatedAt: db.serverDate()
  });

  if (found.data.length) {
    await collection.doc(found.data[0]._id).update({ data });
    return { tutorProfileId: found.data[0]._id };
  }

  const created = await collection.add({
    data: Object.assign(data, {
      ownerOpenid: openid,
      rating: 0,
      createdAt: db.serverDate()
    })
  });
  return { tutorProfileId: created._id };
}

async function submitVerification(openid, event) {
  if (!event.proofFileId) throw new Error('请先上传在读证明');
  const created = await db.collection('verifications').add({
    data: {
      ownerOpenid: openid,
      proofFileId: event.proofFileId,
      status: 'pending',
      createdAt: db.serverDate(),
      updatedAt: db.serverDate()
    }
  });
  return { verificationId: created._id };
}

async function applyDemand(openid, event) {
  if (!event.demandId) throw new Error('缺少需求 ID');

  const [profiles, demandDoc, existing] = await Promise.all([
    db.collection('tutorProfiles').where({ _openid: openid }).limit(1).get(),
    db.collection('demands').doc(event.demandId).get(),
    db.collection('applications').where({ _openid: openid, demandId: event.demandId }).limit(1).get()
  ]);

  const profile = profiles.data[0];
  const demand = demandDoc.data;
  const applyCheck = canApply(profile, demand, existing.data[0]);
  if (!applyCheck.ok) throw new Error(applyCheck.message);

  const created = await db.collection('applications').add({
    data: {
      demandId: event.demandId,
      tutorProfileId: profile._id,
      tutorOpenid: openid,
      learnerOpenid: demand.ownerOpenid,
      status: 'pending',
      createdAt: db.serverDate(),
      updatedAt: db.serverDate()
    }
  });

  await db.collection('conversations').add({
    data: {
      applicationId: created._id,
      participantOpenids: [openid, demand.ownerOpenid],
      title: demand.skill,
      lastMessage: '达人已申请接单，等待学习方确认。',
      createdAt: db.serverDate(),
      updatedAt: db.serverDate()
    }
  });

  return { applicationId: created._id };
}

async function listMessages(openid) {
  const result = await db.collection('conversations')
    .where({ participantOpenids: _.all([openid]) })
    .orderBy('updatedAt', 'desc')
    .limit(50)
    .get();
  return { conversations: result.data };
}

async function sendMessage(openid, event) {
  if (!event.conversationId || !event.text) throw new Error('消息内容不完整');
  const conversation = await db.collection('conversations').doc(event.conversationId).get();
  if (!conversation.data.participantOpenids.includes(openid)) throw new Error('无权发送该会话消息');

  await db.collection('messages').add({
    data: {
      conversationId: event.conversationId,
      senderOpenid: openid,
      text: String(event.text).trim().slice(0, 500),
      createdAt: db.serverDate()
    }
  });
  await db.collection('conversations').doc(event.conversationId).update({
    data: {
      lastMessage: String(event.text).trim().slice(0, 80),
      updatedAt: db.serverDate()
    }
  });
  return { ok: true };
}

function normalizeDemand(input) {
  return {
    learnerInfo: clean(input.learnerInfo),
    skill: clean(input.skill),
    mode: clean(input.mode),
    region: clean(input.region),
    time: clean(input.time),
    budgetMin: Number(input.budgetMin),
    budgetMax: Number(input.budgetMax),
    location: clean(input.location),
    note: clean(input.note)
  };
}

function normalizeTutorProfile(input) {
  return {
    realName: clean(input.realName),
    school: clean(input.school),
    major: clean(input.major),
    grade: clean(input.grade),
    skills: Array.isArray(input.skills) ? input.skills.filter(skill => SKILLS.includes(skill)) : [],
    regions: Array.isArray(input.regions) ? input.regions.filter(region => REGIONS.includes(region)) : [],
    price: Number(input.price),
    bio: clean(input.bio)
  };
}

function validateDemand(demand) {
  const errors = [];
  if (!demand.learnerInfo) errors.push('学员情况不能为空');
  if (!SKILLS.includes(demand.skill)) errors.push('技能类别必须是平台支持的非学科类技能');
  if (!['线上', '线下'].includes(demand.mode)) errors.push('授课方式必须是线上或线下');
  if (!REGIONS.includes(demand.region)) errors.push('服务区域必须在德阳市支持范围内');
  if (!demand.time) errors.push('期望时间不能为空');
  if (!validMoney(demand.budgetMin) || !validMoney(demand.budgetMax) || demand.budgetMin > demand.budgetMax) {
    errors.push('预算必须是有效金额，且最低预算不能高于最高预算');
  }
  if (demand.mode === '线下' && !demand.location) errors.push('线下需求必须填写大致地点');
  return errors;
}

function validateTutorProfile(profile) {
  const errors = [];
  if (!profile.realName) errors.push('真实姓名不能为空');
  if (!profile.school) errors.push('学校不能为空');
  if (!profile.major) errors.push('专业不能为空');
  if (!profile.grade) errors.push('年级不能为空');
  if (!profile.skills.length) errors.push('至少选择一个非学科类技能');
  if (!profile.regions.length) errors.push('至少选择一个德阳服务区域');
  if (!validMoney(profile.price)) errors.push('课时费必须是 1-1000 元之间的数字');
  if (profile.bio.length < 8) errors.push('个人介绍至少 8 个字');
  return errors;
}

function canApply(profile, demand, existing) {
  if (existing) return { ok: false, message: '你已申请过该需求' };
  if (!demand || demand.status !== 'open') return { ok: false, message: '该需求不可申请' };
  if (!profile || profile.verificationStatus !== 'approved') return { ok: false, message: '达人认证通过后才能接单' };
  if (!profile.skills.includes(demand.skill)) return { ok: false, message: '技能不匹配' };
  if (demand.mode === '线下' && !profile.regions.includes(demand.region)) return { ok: false, message: '服务区域不匹配' };
  return { ok: true };
}

function validMoney(value) {
  return Number.isFinite(value) && value > 0 && value <= 1000;
}

function clean(value) {
  return String(value || '').trim();
}
