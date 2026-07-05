const test = require('node:test');
const assert = require('node:assert/strict');

const {
  validateDemandInput,
  validateTutorProfileInput,
  canTutorApply
} = require('../miniprogram/shared/validators');
const { nextApplicationState } = require('../miniprogram/shared/match-state');

test('validateDemandInput accepts a complete non-academic Deyang demand', () => {
  const result = validateDemandInput({
    learnerInfo: '10岁 零基础',
    skill: '编程入门',
    mode: '线下',
    region: '旌阳区',
    time: '周六上午 9:00-11:00',
    budgetMin: 90,
    budgetMax: 120,
    location: '旌阳区凤山路附近',
    note: '培养逻辑思维，不做竞赛培训'
  });

  assert.equal(result.ok, true);
  assert.equal(result.value.skill, '编程入门');
  assert.equal(result.value.budgetMin, 90);
});

test('validateDemandInput rejects academic skills and invalid budgets', () => {
  const result = validateDemandInput({
    learnerInfo: '五年级',
    skill: '数学辅导',
    mode: '线下',
    region: '旌阳区',
    time: '周末',
    budgetMin: 180,
    budgetMax: 120,
    location: '学校附近'
  });

  assert.equal(result.ok, false);
  assert.match(result.errors.join('\n'), /技能类别/);
  assert.match(result.errors.join('\n'), /预算/);
});

test('validateTutorProfileInput requires verification-ready tutor data', () => {
  const result = validateTutorProfileInput({
    realName: '李思远',
    school: '电子科技大学',
    major: '计算机系',
    grade: '大三',
    skills: ['编程入门'],
    regions: ['旌阳区', '经开区'],
    price: 100,
    bio: '少儿编程启蒙与 Python 基础'
  });

  assert.equal(result.ok, true);
  assert.deepEqual(result.value.skills, ['编程入门']);
});

test('canTutorApply blocks unverified, mismatched, and duplicate applications', () => {
  const demand = {
    skill: '编程入门',
    mode: '线下',
    region: '旌阳区',
    status: 'open'
  };

  assert.deepEqual(canTutorApply({
    tutorProfile: { verificationStatus: 'pending', skills: ['编程入门'], regions: ['旌阳区'] },
    demand
  }), { ok: false, reason: 'TUTOR_NOT_VERIFIED' });

  assert.deepEqual(canTutorApply({
    tutorProfile: { verificationStatus: 'approved', skills: ['绘画设计'], regions: ['旌阳区'] },
    demand
  }), { ok: false, reason: 'SKILL_NOT_MATCHED' });

  assert.deepEqual(canTutorApply({
    tutorProfile: { verificationStatus: 'approved', skills: ['编程入门'], regions: ['旌阳区'] },
    demand,
    existingApplication: { status: 'pending' }
  }), { ok: false, reason: 'ALREADY_APPLIED' });
});

test('nextApplicationState only allows the explicit MVP state flow', () => {
  assert.equal(nextApplicationState({ status: 'pending' }, 'learner_accept'), 'matched');
  assert.equal(nextApplicationState({ status: 'pending' }, 'learner_reject'), 'rejected');
  assert.equal(nextApplicationState({ status: 'matched' }, 'complete'), 'completed');
  assert.throws(
    () => nextApplicationState({ status: 'matched' }, 'learner_accept'),
    /Invalid application transition/
  );
});
