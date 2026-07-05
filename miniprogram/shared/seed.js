const tutors = [
  {
    _id: 'seed_tutor_1',
    realName: '李思远',
    school: '电子科技大学',
    major: '计算机系',
    grade: '大三',
    skills: ['编程入门'],
    regions: ['旌阳区', '经开区'],
    price: 100,
    rating: 4.9,
    verificationStatus: 'approved',
    bio: '信息竞赛省一，擅长少儿编程启蒙与 Python 基础。'
  },
  {
    _id: 'seed_tutor_2',
    realName: '陈雨桐',
    school: '四川大学',
    major: '英语系',
    grade: '大二',
    skills: ['口语交流'],
    regions: ['旌阳区', '罗江区'],
    price: 90,
    rating: 4.8,
    verificationStatus: 'approved',
    bio: '日常口语交流陪练与兴趣角活动，不涉及应试课程。'
  }
];

const demands = [
  {
    _id: 'seed_demand_1',
    learnerInfo: '10岁 零基础',
    skill: '编程入门',
    mode: '线下',
    region: '旌阳区',
    time: '周末上午 9:00-11:00',
    budgetMin: 90,
    budgetMax: 120,
    location: '旌阳区凤山路附近',
    note: '培养逻辑思维，不做竞赛培训',
    status: 'open'
  },
  {
    _id: 'seed_demand_2',
    learnerInfo: '12岁 表达兴趣',
    skill: '口语交流',
    mode: '线上',
    region: '经开区',
    time: '工作日晚上',
    budgetMin: 70,
    budgetMax: 90,
    location: '线上',
    note: '提升日常交流自信，不做应试辅导',
    status: 'open'
  }
];

module.exports = { tutors, demands };
