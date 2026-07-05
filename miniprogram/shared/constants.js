const SKILLS = [
  '编程入门',
  '绘画设计',
  '乐器声乐',
  '摄影摄像',
  '口语交流',
  '运动技能',
  '书法棋艺',
  '剪辑运营'
];

const DEYANG_REGIONS = [
  '旌阳区',
  '经开区',
  '罗江区',
  '广汉市',
  '什邡市',
  '绵竹市',
  '中江县'
];

const MODES = ['线上', '线下'];

const COMMISSION_RATES = {
  '线上': 0.1,
  '线下': 0.15
};

const VERIFICATION_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

const DEMAND_STATUS = {
  OPEN: 'open',
  MATCHED: 'matched',
  CLOSED: 'closed'
};

module.exports = {
  SKILLS,
  DEYANG_REGIONS,
  MODES,
  COMMISSION_RATES,
  VERIFICATION_STATUS,
  DEMAND_STATUS
};
