/* ================= 数据 ================= */
// 技能类别：均为非学科类兴趣/技能方向，不含语文数学英语等应试学科辅导
const skillsList = ["编程入门","绘画设计","乐器声乐","摄影摄像","口语交流","运动技能","书法棋艺","剪辑运营"];
const DEYANG_DISTRICTS = ["旌阳区","经开区","罗江区","广汉市","什邡市","绵竹市","中江县"];
// 平台服务费：线上/线下标准不同，从技能达人收入中扣除，发布需求方不收费
const COMMISSION = { "线上": 0.10, "线下": 0.15 };
function commissionInfo(price, mode){
  const rate = COMMISSION[mode];
  const fee = Math.round(price * rate);
  const net = price - fee;
  return {rate, fee, net};
}

const tutors = [
  {id:1,name:"李思远",school:"电子科技大学",major:"计算机系",grade:"大三",skills:["编程入门"],region:["旌阳区","经开区"],price:100,rating:4.9,ratingCount:32,verified:true,gender:"男",exp:2,intro:"信息竞赛省一，擅长少儿编程启蒙与Python基础，逻辑思路清晰，讲解通俗有趣，能针对零基础学员定制学习节奏。",color:"#33469B",
    reviews:[{name:"张女士",stars:5,text:"孩子对编程从没兴趣到主动想学，讲得很生动。"},{name:"王先生",stars:5,text:"专业负责，会提前备课，节奏把握得很好。"}]},
  {id:2,name:"陈雨桐",school:"四川大学",major:"英语系",grade:"大二",skills:["口语交流"],region:["旌阳区","罗江区"],price:90,rating:4.8,ratingCount:21,verified:true,gender:"女",exp:2,intro:"英语专业，发音标准，做的是日常口语交流陪练与兴趣角活动，不涉及应试课程，善于用趣味方法提升表达自信。",color:"#6C8AE8",
    reviews:[{name:"刘女士",stars:5,text:"孩子很喜欢陈老师的口语角活动，敢说了很多。"}]},
  {id:3,name:"赵明宇",school:"西南交通大学",major:"计算机系",grade:"大四",skills:["编程入门","剪辑运营"],region:["广汉市","旌阳区"],price:130,rating:5.0,ratingCount:15,verified:true,gender:"男",exp:2,intro:"擅长少儿编程启蒙与短视频剪辑基础教学，逻辑思路清晰，讲课有条理。",color:"#3DBE7D",
    reviews:[{name:"孙先生",stars:5,text:"孩子编程课上得很开心，赵老师很有耐心。"}]},
  {id:4,name:"周晓萱",school:"西南石油大学",major:"美术学",grade:"大三",skills:["绘画设计"],region:["什邡市"],price:100,rating:4.7,ratingCount:18,verified:false,gender:"女",exp:1,intro:"美术专业，擅长儿童水彩与素描启蒙，正在等待身份认证审核，暂无授课记录展示。",color:"#F2A93B",
    reviews:[]},
  {id:5,name:"黄子轩",school:"四川师范大学",major:"音乐系",grade:"大二",skills:["乐器声乐"],region:["绵竹市","中江县"],price:110,rating:4.6,ratingCount:9,verified:true,gender:"男",exp:1,intro:"钢琴十级，擅长儿童声乐与钢琴入门陪练，性格开朗，善于引导兴趣。",color:"#8A6FD1",
    reviews:[{name:"李女士",stars:4,text:"孩子对钢琴的兴趣明显提高了，老师很会引导。"}]},
];

const demands = [
  {id:1,parentName:"张女士",learnerInfo:"10岁·零基础",skill:"编程入门",mode:"线下",region:"旌阳区",time:"周末上午 9:00-11:00",budget:"90-120元/小时",location:"旌阳区凤山路附近，具体地址联系后告知",note:"想让孩子接触编程启蒙，培养逻辑思维，不求赛事成绩。",status:"open"},
  {id:2,parentName:"王先生",learnerInfo:"12岁·有一定基础",skill:"口语交流",mode:"线上",region:"经开区",time:"工作日晚上 19:00-20:00",budget:"70-90元/小时",location:"线上授课",note:"希望多做口语表达陪练，提升交流自信，不是应试课程。",status:"open"},
  {id:3,parentName:"刘女士",learnerInfo:"15岁·兴趣入门",skill:"摄影摄像",mode:"线下",region:"广汉市",time:"周六下午 14:00-16:00",budget:"100-130元/小时",location:"广汉市金雁路附近",note:"孩子喜欢拍视频，想系统学一下构图和剪辑思路。",status:"open"},
  {id:4,parentName:"孙先生",learnerInfo:"13岁·信息学兴趣",skill:"剪辑运营",mode:"线上",region:"什邡市",time:"周日全天可约",budget:"100-130元/小时",location:"线上授课",note:"想学习短视频剪辑基础，做自己的兴趣频道。",status:"open"},
  {id:5,parentName:"李女士",learnerInfo:"9岁·零基础",skill:"绘画设计",mode:"线下",region:"绵竹市",time:"周三、周五晚上",budget:"70-90元/小时",location:"绵竹市剑南大道附近",note:"主要想培养绘画兴趣，不需要考级。",status:"open"},
];

const notifications = [
  {id:1,type:"sys",title:"平台公告",text:"学途技能仅提供非学科类兴趣技能分享，请勿发布学科类课程内容。",time:"10分钟前"},
  {id:2,type:"sys",title:"审核通知",text:"你的身份认证材料已通过审核 ✅",time:"1小时前"},
];

let chats = [];

/* ================= 状态 ================= */
let state = {
  role: null,
  tab: 'square',
  filterSkill: '全部',
  myDemands: [],
  myApplications: [],
  favoriteTutors: [],
  profile: { name:"我", school:"", major:"", grade:"", skills:[], region:[], price:"", exp:"", verified:false, submitted:false }
};

/* ================= 角色选择 ================= */
function selectRole(role){
  state.role = role;
  document.getElementById('role-select').style.display = 'none';
  document.getElementById('main-shell').style.display = 'flex';
  state.tab = 'square';
  renderNav();
  renderTab('square');
}
function switchRole(){
  state.role = state.role === 'parent' ? 'tutor' : 'parent';
  state.tab = 'square';
  showToast('演示：已切换为 ' + (state.role === 'parent' ? '学习需求方' : '技能达人') + ' 身份');
  renderNav();
  renderTab('square');
}

/* ================= 导航 ================= */
const navConfig = {
  parent: [
    {key:'square', icon:'🔍', text:'找达人'},
    {key:'secondary', icon:'📝', text:'发需求'},
    {key:'messages', icon:'💬', text:'消息'},
    {key:'me', icon:'🙂', text:'我的'},
  ],
  tutor: [
    {key:'square', icon:'📋', text:'接单广场'},
    {key:'secondary', icon:'📌', text:'我的申请'},
    {key:'messages', icon:'💬', text:'消息'},
    {key:'me', icon:'🙂', text:'我的'},
  ]
};
function renderNav(){
  const nav = document.getElementById('bottom-nav');
  const items = navConfig[state.role];
  nav.innerHTML = items.map(it => `
    <div class="nav-item ${state.tab===it.key?'active':''}" onclick="renderTab('${it.key}')">
      <span class="nav-icon">${it.icon}</span><span class="nav-text">${it.text}</span>
    </div>`).join('');
}
const titles = {
  parent: {square:'找技能达人', secondary:'发布需求', messages:'消息', me:'我的'},
  tutor: {square:'接单广场', secondary:'我的申请', messages:'消息', me:'我的'}
};
function renderTab(tab){
  state.tab = tab;
  document.getElementById('header-title').textContent = titles[state.role][tab];
  renderNav();
  const content = document.getElementById('content');
  content.scrollTop = 0;
  if(tab === 'square') content.innerHTML = state.role === 'parent' ? tutorSquareHtml() : demandSquareHtml();
  else if(tab === 'secondary') content.innerHTML = state.role === 'parent' ? publishFormHtml() : myApplicationsHtml();
  else if(tab === 'messages') content.innerHTML = messagesHtml();
  else if(tab === 'me') content.innerHTML = meHtml();
}

/* ================= 找技能达人广场 ================= */
function tutorSquareHtml(){
  const chips = ['全部', ...skillsList];
  const filtered = state.filterSkill === '全部' ? tutors : tutors.filter(t => t.skills.includes(state.filterSkill));
  return `
    <div class="chip-row">${chips.map(c => `<div class="chip ${state.filterSkill===c?'active':''}" onclick="setSkillFilter('${c}')">${c}</div>`).join('')}</div>
    <div class="list-pad">${filtered.length ? filtered.map(t => tutorCardHtml(t)).join('') : `<div class="empty-hint">暂无该技能方向的达人，换个筛选试试</div>`}</div>
  `;
}
function setSkillFilter(s){ state.filterSkill = s; renderTab('square'); }
function tutorCardHtml(t){
  return `
    <div class="tutor-card" onclick="openTutorDetail(${t.id})">
      <div class="avatar" style="background:${t.color}">${t.name[0]}${t.verified ? '<div class="verify-badge">✓</div>' : ''}</div>
      <div class="tc-body">
        <span class="tc-name">${t.name}</span>
        <div class="tc-meta">${t.school} · ${t.major} · ${t.grade}</div>
        <div class="tag-row">${t.skills.map(s=>`<span class="tag">${s}</span>`).join('')}${t.region.map(r=>`<span class="tag-region">📍${r}</span>`).join('')}</div>
        <div class="tc-foot">
          <span class="price">¥${t.price}<span>/小时</span></span>
          <span class="rating">⭐ <b>${t.rating}</b> (${t.ratingCount})</span>
        </div>
      </div>
    </div>`;
}

/* ================= 接单广场 ================= */
function demandSquareHtml(){
  const chips = ['全部', ...skillsList];
  const filtered = state.filterSkill === '全部' ? demands : demands.filter(d => d.skill === state.filterSkill);
  return `
    <div class="chip-row">${chips.map(c => `<div class="chip ${state.filterSkill===c?'active':''}" onclick="setSkillFilter('${c}')">${c}</div>`).join('')}</div>
    <div class="list-pad">${filtered.length ? filtered.map(d => demandCardHtml(d)).join('') : `<div class="empty-hint">暂无该技能方向的需求，换个筛选试试</div>`}</div>
  `;
}
function demandCardHtml(d){
  const applied = state.myApplications.find(a => a.id === d.id);
  const statusText = applied ? (applied.status === 'pending' ? '已申请·待确认' : '已匹配成功') : '招募中';
  const statusClass = applied ? (applied.status === 'pending' ? 'status-pending' : 'status-matched') : 'status-open';
  return `
    <div class="demand-card" onclick="openDemandDetail(${d.id})">
      <div class="dc-top"><span class="dc-subject">${d.skill}</span><span class="status-tag ${statusClass}">${statusText}</span></div>
      <div class="dc-info">
        <div>🧒 学员情况：${d.learnerInfo}</div>
        <div>📍 <b>${d.mode}</b> · ${d.region} · ${d.location}</div>
        <div>🕐 ${d.time}</div>
      </div>
      <div class="dc-budget">${d.budget}</div>
    </div>`;
}

/* ================= 发布需求 ================= */
let draftDemand = {learnerInfo:'', skill:'', mode:'线下', region:'', time:'', budget:'', location:'', note:''};
function publishFormHtml(){
  const myList = state.myDemands;
  return `
    <div class="form-wrap">
      <div class="hint-box">📌 请仅发布编程、美术、乐器、摄影、口语交流、运动、棋艺等非学科类兴趣技能需求，平台不支持语文/数学/英语等学科类课程内容的发布。</div>
      <div class="form-card">
        <div class="form-row"><span class="form-label">学员情况（年龄/年级/基础）</span><input type="text" id="f-learner" placeholder="例如：10岁·零基础" value="${draftDemand.learnerInfo}"></div>
        <div class="form-row">
          <span class="form-label">技能类别</span>
          <div class="subject-grid">${skillsList.map(s => `<div class="subject-pill ${draftDemand.skill===s?'active':''}" onclick="setDraftSkill('${s}')">${s}</div>`).join('')}</div>
        </div>
        <div class="form-row">
          <span class="form-label">授课方式</span>
          <div class="seg-row">
            <div class="seg-btn ${draftDemand.mode==='线下'?'active':''}" onclick="setDraftMode('线下')">线下上门</div>
            <div class="seg-btn ${draftDemand.mode==='线上'?'active':''}" onclick="setDraftMode('线上')">线上授课</div>
          </div>
        </div>
        <div class="form-row">
          <span class="form-label">服务区域（目前仅支持德阳市）</span>
          <div class="subject-grid">${DEYANG_DISTRICTS.map(r => `<div class="subject-pill ${draftDemand.region===r?'active':''}" onclick="setDraftRegion('${r}')">${r}</div>`).join('')}</div>
        </div>
        <div class="form-row"><span class="form-label">期望时间</span><input type="text" id="f-time" placeholder="例如：周末上午" value="${draftDemand.time}"></div>
        <div class="form-row"><span class="form-label">预算(元/小时)</span><input type="text" id="f-budget" placeholder="例如：90-120元/小时" value="${draftDemand.budget}"></div>
        <div class="form-row"><span class="form-label">详细地址/说明</span><input type="text" id="f-location" placeholder="线下请填写大致地址，线上可填线上" value="${draftDemand.location}"></div>
        <div class="form-row"><span class="form-label">补充说明</span><textarea id="f-note" rows="2" placeholder="学员情况、想重点提升的方向...">${draftDemand.note}</textarea></div>
      </div>
      <button class="submit-btn" onclick="submitDemand()">发布需求</button>
      ${myList.length ? `<div class="section-title">我发布的需求</div><div style="display:flex;flex-direction:column;gap:12px;">${myList.map(d => demandCardHtml(d)).join('')}</div>` : ''}
    </div>`;
}
function setDraftSkill(s){ draftDemand.skill = s; renderTab('secondary'); }
function setDraftMode(m){ draftDemand.mode = m; renderTab('secondary'); }
function setDraftRegion(r){ draftDemand.region = r; renderTab('secondary'); }
function submitDemand(){
  draftDemand.learnerInfo = document.getElementById('f-learner').value.trim();
  draftDemand.time = document.getElementById('f-time').value.trim();
  draftDemand.budget = document.getElementById('f-budget').value.trim();
  draftDemand.location = document.getElementById('f-location').value.trim();
  draftDemand.note = document.getElementById('f-note').value.trim();
  if(!draftDemand.learnerInfo || !draftDemand.skill || !draftDemand.region || !draftDemand.time || !draftDemand.budget){
    showToast('请填写学员情况、技能类别、服务区域、时间和预算');
    return;
  }
  const newId = 100 + state.myDemands.length + 1;
  const newDemand = {id:newId, parentName:'我', ...draftDemand, status:'open'};
  state.myDemands.unshift(newDemand);
  demands.unshift(newDemand);
  showToast('发布成功！已通知匹配的技能达人');
  draftDemand = {learnerInfo:'', skill:'', mode:'线下', region:'', time:'', budget:'', location:'', note:''};
  renderTab('secondary');
}

/* ================= 我的申请 ================= */
function myApplicationsHtml(){
  const apps = state.myApplications;
  if(!apps.length) return `<div class="empty-hint">还没有申请任何需求<br>去「接单广场」看看有没有合适的吧</div>`;
  return `<div class="list-pad">${apps.map(a => { const d = demands.find(x => x.id === a.id); return d ? demandCardHtml(d) : ''; }).join('')}</div>`;
}

/* ================= 达人详情 ================= */
function openTutorDetail(id){
  const t = tutors.find(x => x.id === id);
  const feeLine = COMMISSION_TABLE_HTML(t.price);
  document.getElementById('overlay-title').textContent = '达人详情';
  document.getElementById('overlay-content').innerHTML = `
    <div class="detail-hero">
      <div class="avatar" style="background:${t.color}">${t.name[0]}${t.verified?'<div class="verify-badge">✓</div>':''}</div>
      <div>
        <div class="detail-name-row"><h2>${t.name}</h2>${t.verified ? '<span class="verified-pill">✓ 已认证</span>' : '<span class="verified-pill" style="background:#FFF3E0;color:#DB9426;">待认证</span>'}</div>
        <div class="detail-meta">${t.school} · ${t.major} · ${t.grade}</div>
        <div class="detail-meta">⭐ ${t.rating} 分 (${t.ratingCount}条评价) · 分享经验${t.exp}年</div>
      </div>
    </div>
    <div class="detail-block"><h4>擅长技能</h4><div class="tag-row">${t.skills.map(s=>`<span class="tag">${s}</span>`).join('')}${t.region.map(r=>`<span class="tag-region">📍${r}</span>`).join('')}</div></div>
    <div class="detail-block"><h4>自我介绍</h4><p>${t.intro}</p></div>
    <div class="detail-block">
      <h4>收费标准（线上/线下服务费不同）</h4>
      <div class="fee-row"><span>课时费</span><span>¥${t.price}/小时</span></div>
      ${feeLine}
    </div>
    <div class="detail-block">
      <h4>学员评价 (${t.reviews.length})</h4>
      ${t.reviews.length ? t.reviews.map(r => `<div class="review-item"><div class="rv-top"><span class="rv-name">${r.name}</span><span class="stars">${'★'.repeat(r.stars)}${'☆'.repeat(5-r.stars)}</span></div><p>${r.text}</p></div>`).join('') : '<p style="color:var(--text-faint);">暂无评价</p>'}
    </div>
    <div style="height:70px;"></div>
    <div class="action-bar">
      <button class="ghost-btn" onclick="toggleFavorite(${t.id})">${state.favoriteTutors.includes(t.id)?'已收藏 ★':'收藏 ☆'}</button>
      <button class="primary-btn" onclick="contactTutor(${t.id})">申请联系</button>
    </div>`;
  document.getElementById('overlay').style.display = 'flex';
}
function COMMISSION_TABLE_HTML(price){
  const online = commissionInfo(price, '线上');
  const offline = commissionInfo(price, '线下');
  return `
    <div class="fee-row"><span>线上服务费 (${Math.round(online.rate*100)}%)</span><span>¥${online.fee}/小时</span></div>
    <div class="fee-row"><span>线上到手</span><span>¥${online.net}/小时</span></div>
    <div class="fee-row" style="margin-top:6px;"><span>线下服务费 (${Math.round(offline.rate*100)}%)</span><span>¥${offline.fee}/小时</span></div>
    <div class="fee-row total"><span>线下到手</span><span>¥${offline.net}/小时</span></div>
  `;
}
function toggleFavorite(id){
  const i = state.favoriteTutors.indexOf(id);
  if(i>=0){ state.favoriteTutors.splice(i,1); showToast('已取消收藏'); }
  else { state.favoriteTutors.push(id); showToast('已收藏该达人'); }
  openTutorDetail(id);
}
function contactTutor(id){
  const t = tutors.find(x=>x.id===id);
  showToast('申请已发送，等待达人确认');
  closeOverlay();
  setTimeout(() => {
    let chat = chats.find(c => c.tutorId === id);
    if(!chat){
      chat = {id: 'c'+id, tutorId:id, name:t.name, color:t.color, unread:1, lastMsg:'对方已同意你的联系申请，可以开始沟通～', time:'刚刚',
        messages:[{from:'sys', text:`你与${t.name}已建立联系，请文明沟通，交易请通过平台保障服务完成。`}]};
      chats.push(chat);
    } else { chat.unread++; chat.lastMsg = '对方已同意你的联系申请，可以开始沟通～'; }
    notifications.unshift({id:Date.now(),type:'sys',title:'匹配成功',text:`${t.name} 已同意你的联系申请，快去聊聊吧`,time:'刚刚'});
    if(state.tab==='messages') renderTab('messages');
  }, 1500);
}

/* ================= 需求详情 ================= */
function openDemandDetail(id){
  const d = demands.find(x => x.id === id);
  const applied = state.myApplications.find(a => a.id === id);
  document.getElementById('overlay-title').textContent = '需求详情';
  document.getElementById('overlay-content').innerHTML = `
    <div class="detail-hero">
      <div class="avatar" style="background:var(--primary)">${d.parentName[0]}</div>
      <div><div class="detail-name-row"><h2>${d.skill}</h2></div><div class="detail-meta">发布人：${d.parentName}</div></div>
    </div>
    <div class="detail-block">
      <h4>需求信息</h4>
      <p>🧒 学员情况：${d.learnerInfo}</p>
      <p style="margin-top:6px;">📍 授课方式：${d.mode}　区域：${d.region}　地点：${d.location}</p>
      <p style="margin-top:6px;">🕐 期望时间：${d.time}</p>
      <p style="margin-top:6px;">💰 预算：<span class="price">${d.budget}</span></p>
    </div>
    <div class="detail-block"><h4>补充说明</h4><p>${d.note || '暂无补充说明'}</p></div>
    <div style="height:70px;"></div>
    <div class="action-bar">
      <button class="primary-btn" ${applied ? 'disabled' : ''} onclick="applyDemand(${d.id})" style="flex:1;">
        ${applied ? (applied.status==='pending' ? '已申请，等待确认' : '已匹配成功') : '申请这个需求'}
      </button>
    </div>`;
  document.getElementById('overlay').style.display = 'flex';
}
function applyDemand(id){
  if(state.myApplications.find(a=>a.id===id)) return;
  const d = demands.find(x=>x.id===id);
  state.myApplications.push({id, status:'pending'});
  showToast('申请已提交，等待对方确认');
  closeOverlay();
  setTimeout(() => {
    const app = state.myApplications.find(a=>a.id===id);
    if(app) app.status = 'matched';
    let chat = chats.find(c => c.demandId === id);
    if(!chat){
      chat = {id:'d'+id, demandId:id, name:d.parentName, color:'#33469B', unread:1, lastMsg:'对方已确认匹配，可以开始沟通～', time:'刚刚',
        messages:[{from:'sys', text:`你与${d.parentName}已建立联系，请文明沟通，交易请通过平台保障服务完成。`}]};
      chats.push(chat);
    }
    notifications.unshift({id:Date.now(),type:'sys',title:'匹配成功',text:`${d.parentName} 已确认你的申请，快去聊聊吧`,time:'刚刚'});
    if(state.tab==='secondary') renderTab('secondary');
    if(state.tab==='messages') renderTab('messages');
  }, 1500);
}

/* ================= 消息 ================= */
function messagesHtml(){
  const sysHtml = notifications.map(n => `
    <div class="msg-list-item">
      <div class="avatar sys-icon" style="width:44px;height:44px;font-size:17px;border-radius:10px;">🔔</div>
      <div class="msg-body"><div class="msg-row1"><span class="msg-title">${n.title}</span><span class="msg-time">${n.time}</span></div><div class="msg-preview">${n.text}</div></div>
    </div>`).join('');
  const chatHtml = chats.map(c => `
    <div class="msg-list-item" onclick="openChat('${c.id}')">
      <div class="avatar" style="background:${c.color}">${c.name[0]}</div>
      <div class="msg-body"><div class="msg-row1"><span class="msg-title">${c.name}</span><span class="msg-time">${c.time}</span></div><div class="msg-preview">${c.lastMsg}</div></div>
      ${c.unread ? '<div class="msg-dot"></div>' : ''}
    </div>`).join('');
  if(!sysHtml && !chatHtml) return `<div class="empty-hint">暂无消息</div>`;
  return `${chatHtml ? `<div class="section-title">聊天</div>${chatHtml}` : ''}<div class="section-title">系统通知</div>${sysHtml}`;
}
function openChat(chatId){
  const c = chats.find(x => x.id === chatId);
  c.unread = 0;
  document.getElementById('overlay-title').textContent = c.name;
  document.getElementById('overlay-content').innerHTML = `
    <div style="display:flex;flex-direction:column;height:100%;">
      <div class="chat-box" id="chat-box">${c.messages.map(m => chatMsgHtml(m, c)).join('')}</div>
      <div class="chat-input-bar">
        <input type="text" id="chat-input" placeholder="输入消息..." onkeydown="if(event.key==='Enter')sendChat('${chatId}')">
        <button class="chat-send" onclick="sendChat('${chatId}')">发送</button>
      </div>
    </div>`;
  document.getElementById('overlay').style.display = 'flex';
  const box = document.getElementById('chat-box'); box.scrollTop = box.scrollHeight;
}
function chatMsgHtml(m, c){
  if(m.from === 'sys') return `<div class="chat-system">${m.text}</div>`;
  return `<div class="chat-row ${m.from==='me'?'sent':'recv'}"><div class="chat-avatar" style="background:${m.from==='me'?'#33469B':c.color}">${m.from==='me'?'我':c.name[0]}</div><div class="chat-bubble">${m.text}</div></div>`;
}
function sendChat(chatId){
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if(!text) return;
  const c = chats.find(x => x.id === chatId);
  c.messages.push({from:'me', text}); c.lastMsg = text; c.time = '刚刚';
  input.value = '';
  const box = document.getElementById('chat-box');
  box.innerHTML = c.messages.map(m => chatMsgHtml(m, c)).join(''); box.scrollTop = box.scrollHeight;
  setTimeout(() => {
    const replies = ["好的，没问题～","嗯嗯，我了解了","方便的话可以再详细说说吗？","好呀，就这么定了"];
    c.messages.push({from:'them', text: replies[Math.floor(Math.random()*replies.length)]});
    c.lastMsg = c.messages[c.messages.length-1].text;
    box.innerHTML = c.messages.map(m => chatMsgHtml(m, c)).join(''); box.scrollTop = box.scrollHeight;
  }, 1100);
}

/* ================= 我的 ================= */
function meHtml(){
  if(state.role === 'parent'){
    return `
      <div class="me-hero"><div class="avatar">🙋</div><div><h2>${state.profile.name}</h2><span class="role-pill">学习需求方</span></div></div>
      <div class="me-status">
        <div class="me-stat"><b>${state.myDemands.length}</b><span>发布需求</span></div>
        <div class="me-stat"><b>${state.favoriteTutors.length}</b><span>收藏达人</span></div>
        <div class="me-stat"><b>${chats.length}</b><span>联系中</span></div>
      </div>
      <div class="menu-group">
        <div class="menu-item" onclick="renderTab('secondary')"><div class="menu-icon" style="background:#33469B;">📝</div><span>我的需求</span><span class="chevron">›</span></div>
        <div class="menu-item"><div class="menu-icon" style="background:#F2A93B;">★</div><span>我的收藏</span><span class="chevron">›</span></div>
        <div class="menu-item"><div class="menu-icon" style="background:#3DBE7D;">🛡️</div><span>交易保障</span><span class="chevron">›</span></div>
      </div>
      <div class="menu-group">
        <div class="menu-item" onclick="openRules()"><div class="menu-icon" style="background:#6C8AE8;">📋</div><span>平台规则说明</span><span class="chevron">›</span></div>
        <div class="menu-item"><div class="menu-icon" style="background:#8A8FA3;">⚙️</div><span>设置</span><span class="chevron">›</span></div>
        <div class="menu-item"><div class="menu-icon" style="background:#8A8FA3;">☎️</div><span>联系客服</span><span class="chevron">›</span></div>
      </div>
      <div class="demo-switch">演示切换身份：<a onclick="switchRole()">切换为技能达人视角</a></div>`;
  } else {
    const p = state.profile;
    return `
      <div class="me-hero"><div class="avatar">🎓</div><div><h2>${p.name}</h2><span class="role-pill">技能达人</span></div></div>
      <div class="me-status">
        <div class="me-stat"><b>${state.myApplications.length}</b><span>已申请</span></div>
        <div class="me-stat"><b>${state.myApplications.filter(a=>a.status==='matched').length}</b><span>已接单</span></div>
        <div class="me-stat"><b>${chats.length}</b><span>联系中</span></div>
      </div>
      <div class="menu-group">
        <div class="menu-item" onclick="openProfileEdit()">
          <div class="menu-icon" style="background:#33469B;">📄</div><span>资料与认证</span>
          <span class="cert-badge ${p.verified ? 'cert-verified' : 'cert-pending'}">${p.verified ? '已认证' : (p.submitted ? '审核中' : '待完善')}</span>
        </div>
        <div class="menu-item" onclick="renderTab('secondary')"><div class="menu-icon" style="background:#F2A93B;">📌</div><span>我的申请</span><span class="chevron">›</span></div>
        <div class="menu-item"><div class="menu-icon" style="background:#3DBE7D;">💬</div><span>收到的评价</span><span class="chevron">›</span></div>
      </div>
      <div class="menu-group">
        <div class="menu-item" onclick="openRules()"><div class="menu-icon" style="background:#6C8AE8;">📋</div><span>平台规则说明</span><span class="chevron">›</span></div>
        <div class="menu-item"><div class="menu-icon" style="background:#8A8FA3;">⚙️</div><span>设置</span><span class="chevron">›</span></div>
        <div class="menu-item"><div class="menu-icon" style="background:#8A8FA3;">☎️</div><span>联系客服</span><span class="chevron">›</span></div>
      </div>
      <div class="demo-switch">演示切换身份：<a onclick="switchRole()">切换为学习需求方视角</a></div>`;
  }
}

/* ================= 平台规则说明 ================= */
function openRules(){
  document.getElementById('overlay-title').textContent = '平台规则说明';
  document.getElementById('overlay-content').innerHTML = `
    <div class="detail-block">
      <h4>服务范围</h4>
      <p>学途技能是大学生非学科类兴趣技能分享平台，目前支持编程入门、绘画设计、乐器声乐、摄影摄像、口语交流、运动技能、书法棋艺、剪辑运营八大方向，<b>不支持</b>语文、数学、英语、物理、化学等学科类课程内容的发布与撮合。</p>
    </div>
    <div class="detail-block">
      <h4>服务区域</h4>
      <p>目前仅开放德阳市（旌阳区、经开区、罗江区、广汉市、什邡市、绵竹市、中江县）用户使用。</p>
    </div>
    <div class="detail-block">
      <h4>费用说明</h4>
      <p>发布需求免费；技能达人接单成功后，平台按订单课时费收取服务费：线上10%，线下15%，差异源于线下履约与安全保障成本更高。</p>
    </div>
    <div class="detail-block">
      <h4>身份认证</h4>
      <p>技能达人需上传在读证明并通过人工审核，未认证前不展示"已认证"标识，请学习需求方注意甄别。</p>
    </div>
    <div class="detail-block">
      <h4>提示</h4>
      <p>本说明为产品定位与运营规则展示，不构成法律意见；平台正式上线前，建议就经营范围、备案要求等事项向当地主管部门或专业律师咨询确认。</p>
    </div>
  `;
  document.getElementById('overlay').style.display = 'flex';
}

/* ================= 资料/认证编辑 ================= */
function openProfileEdit(){
  const p = state.profile;
  document.getElementById('overlay-title').textContent = '资料与认证';
  document.getElementById('overlay-content').innerHTML = `
    <div class="form-wrap">
      <div class="form-card">
        <div class="form-row"><span class="form-label">姓名</span><input type="text" id="p-name" value="${p.name==='我'?'':p.name}" placeholder="请输入真实姓名"></div>
        <div class="form-row"><span class="form-label">学校</span><input type="text" id="p-school" value="${p.school}" placeholder="例如：电子科技大学"></div>
        <div class="form-row"><span class="form-label">专业</span><input type="text" id="p-major" value="${p.major}" placeholder="例如：计算机系"></div>
        <div class="form-row"><span class="form-label">年级</span><input type="text" id="p-grade" value="${p.grade}" placeholder="例如：大三"></div>
        <div class="form-row">
          <span class="form-label">擅长技能（可多选）</span>
          <div class="subject-grid">${skillsList.map(s => `<div class="subject-pill ${p.skills.includes(s)?'active':''}" onclick="toggleProfileSkill('${s}')">${s}</div>`).join('')}</div>
        </div>
        <div class="form-row">
          <span class="form-label">可服务区域（德阳市，可多选）</span>
          <div class="subject-grid">${DEYANG_DISTRICTS.map(r => `<div class="subject-pill ${p.region.includes(r)?'active':''}" onclick="toggleProfileRegion('${r}')">${r}</div>`).join('')}</div>
        </div>
        <div class="form-row"><span class="form-label">期望课时费(元/小时)</span><input type="text" id="p-price" value="${p.price}" placeholder="例如：100"></div>
        <div class="form-row"><span class="form-label">分享经验</span><input type="text" id="p-exp" value="${p.exp}" placeholder="例如：1年兴趣陪伴经验"></div>
        <div class="form-row">
          <span class="form-label">身份认证材料</span>
          <div class="seg-row"><div class="seg-btn ${p.submitted?'active':''}" style="flex:none;padding:9px 16px;" onclick="mockUpload()">${p.submitted ? '已上传在读证明 ✓' : '📎 上传学生证/在读证明'}</div></div>
        </div>
      </div>
      <button class="submit-btn" onclick="saveProfile()">保存并提交审核</button>
    </div>`;
  document.getElementById('overlay').style.display = 'flex';
}
function toggleProfileSkill(s){ const p = state.profile; const i = p.skills.indexOf(s); if(i>=0) p.skills.splice(i,1); else p.skills.push(s); openProfileEdit(); }
function toggleProfileRegion(r){ const p = state.profile; const i = p.region.indexOf(r); if(i>=0) p.region.splice(i,1); else p.region.push(r); openProfileEdit(); }
function mockUpload(){ state.profile.submitted = true; showToast('已上传，等待人工审核（模拟）'); openProfileEdit(); }
function saveProfile(){
  const p = state.profile;
  p.name = document.getElementById('p-name').value.trim() || '我';
  p.school = document.getElementById('p-school').value.trim();
  p.major = document.getElementById('p-major').value.trim();
  p.grade = document.getElementById('p-grade').value.trim();
  p.price = document.getElementById('p-price').value.trim();
  p.exp = document.getElementById('p-exp').value.trim();
  if(!p.school || !p.skills.length || !p.region.length){
    showToast('请至少填写学校、擅长技能并选择可服务区域');
    return;
  }
  showToast('资料已保存，审核结果会通过消息通知你');
  closeOverlay();
  setTimeout(() => {
    if(p.submitted && !p.verified){
      p.verified = true;
      notifications.unshift({id:Date.now(),type:'sys',title:'审核通知',text:'你的身份认证材料已通过审核 ✅',time:'刚刚'});
      if(state.tab==='me') renderTab('me');
    }
  }, 2000);
}

/* ================= 覆盖层/提示 ================= */
function closeOverlay(){ document.getElementById('overlay').style.display = 'none'; }
function showToast(text){
  const t = document.getElementById('toast');
  t.textContent = text; t.style.display = 'block';
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => { t.style.display = 'none'; }, 2000);
}
