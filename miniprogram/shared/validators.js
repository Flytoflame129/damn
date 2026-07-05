const {
  SKILLS,
  DEYANG_REGIONS,
  MODES,
  VERIFICATION_STATUS,
  DEMAND_STATUS
} = require('./constants');

function cleanText(value) {
  return String(value || '').trim();
}

function isPositiveMoney(value) {
  return Number.isFinite(value) && value > 0 && value <= 1000;
}

function validateDemandInput(input) {
  const errors = [];
  const value = {
    learnerInfo: cleanText(input.learnerInfo),
    skill: cleanText(input.skill),
    mode: cleanText(input.mode),
    region: cleanText(input.region),
    time: cleanText(input.time),
    budgetMin: Number(input.budgetMin),
    budgetMax: Number(input.budgetMax),
    location: cleanText(input.location),
    note: cleanText(input.note),
    status: DEMAND_STATUS.OPEN
  };

  if (!value.learnerInfo) errors.push('学员情况不能为空');
  if (!SKILLS.includes(value.skill)) errors.push('技能类别必须是平台支持的非学科类技能');
  if (!MODES.includes(value.mode)) errors.push('授课方式必须是线上或线下');
  if (!DEYANG_REGIONS.includes(value.region)) errors.push('服务区域必须在德阳市支持范围内');
  if (!value.time) errors.push('期望时间不能为空');
  if (!isPositiveMoney(value.budgetMin) || !isPositiveMoney(value.budgetMax) || value.budgetMin > value.budgetMax) {
    errors.push('预算必须是有效金额，且最低预算不能高于最高预算');
  }
  if (value.mode === '线下' && !value.location) errors.push('线下需求必须填写大致地点');

  return errors.length ? { ok: false, errors } : { ok: true, value };
}

function validateTutorProfileInput(input) {
  const errors = [];
  const value = {
    realName: cleanText(input.realName),
    school: cleanText(input.school),
    major: cleanText(input.major),
    grade: cleanText(input.grade),
    skills: Array.isArray(input.skills) ? input.skills.filter(skill => SKILLS.includes(skill)) : [],
    regions: Array.isArray(input.regions) ? input.regions.filter(region => DEYANG_REGIONS.includes(region)) : [],
    price: Number(input.price),
    bio: cleanText(input.bio),
    verificationStatus: input.verificationStatus || VERIFICATION_STATUS.DRAFT
  };

  if (!value.realName) errors.push('真实姓名不能为空');
  if (!value.school) errors.push('学校不能为空');
  if (!value.major) errors.push('专业不能为空');
  if (!value.grade) errors.push('年级不能为空');
  if (!value.skills.length) errors.push('至少选择一个非学科类技能');
  if (!value.regions.length) errors.push('至少选择一个德阳服务区域');
  if (!isPositiveMoney(value.price)) errors.push('课时费必须是 1-1000 元之间的数字');
  if (value.bio.length < 8) errors.push('个人介绍至少 8 个字');

  return errors.length ? { ok: false, errors } : { ok: true, value };
}

function canTutorApply({ tutorProfile, demand, existingApplication }) {
  if (existingApplication) return { ok: false, reason: 'ALREADY_APPLIED' };
  if (!demand || demand.status !== DEMAND_STATUS.OPEN) return { ok: false, reason: 'DEMAND_NOT_OPEN' };
  if (!tutorProfile || tutorProfile.verificationStatus !== VERIFICATION_STATUS.APPROVED) {
    return { ok: false, reason: 'TUTOR_NOT_VERIFIED' };
  }
  if (!Array.isArray(tutorProfile.skills) || !tutorProfile.skills.includes(demand.skill)) {
    return { ok: false, reason: 'SKILL_NOT_MATCHED' };
  }
  if (demand.mode === '线下' && (!Array.isArray(tutorProfile.regions) || !tutorProfile.regions.includes(demand.region))) {
    return { ok: false, reason: 'REGION_NOT_MATCHED' };
  }
  return { ok: true };
}

module.exports = {
  validateDemandInput,
  validateTutorProfileInput,
  canTutorApply
};
