const api = require('../../utils/api');
const { SKILLS, DEYANG_REGIONS } = require('../../shared/constants');
const { validateTutorProfileInput } = require('../../shared/validators');

Page({
  data: {
    skills: SKILLS,
    regions: DEYANG_REGIONS,
    form: {
      realName: '',
      school: '',
      major: '',
      grade: '',
      skills: [],
      regions: [],
      price: '',
      bio: ''
    },
    proofFileId: ''
  },

  updateField(event) {
    const key = event.currentTarget.dataset.key;
    this.setData({ [`form.${key}`]: event.detail.value });
  },

  toggleSkill(event) {
    const skill = event.currentTarget.dataset.value;
    const skills = this.toggle(this.data.form.skills, skill);
    this.setData({ 'form.skills': skills });
  },

  toggleRegion(event) {
    const region = event.currentTarget.dataset.value;
    const regions = this.toggle(this.data.form.regions, region);
    this.setData({ 'form.regions': regions });
  },

  toggle(list, value) {
    return list.includes(value) ? list.filter(item => item !== value) : list.concat(value);
  },

  chooseProof() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      success: res => {
        const file = res.tempFiles[0];
        wx.cloud.uploadFile({
          cloudPath: `verification/${Date.now()}-${file.tempFilePath.split('/').pop()}`,
          filePath: file.tempFilePath,
          success: upload => this.setData({ proofFileId: upload.fileID })
        });
      }
    });
  },

  submit() {
    const result = validateTutorProfileInput(this.data.form);
    if (!result.ok) {
      wx.showToast({ title: result.errors[0], icon: 'none' });
      return;
    }
    api.saveTutorProfile(result.value)
      .then(() => api.submitVerification({ proofFileId: this.data.proofFileId }))
      .then(() => {
        wx.showToast({ title: '已提交审核' });
        wx.switchTab({ url: '/pages/me/me' });
      })
      .catch(() => wx.showToast({ title: '提交失败，请检查云环境', icon: 'none' }));
  }
});
