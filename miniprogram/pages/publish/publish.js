const api = require('../../utils/api');
const { SKILLS, DEYANG_REGIONS, MODES } = require('../../shared/constants');
const { validateDemandInput } = require('../../shared/validators');

Page({
  data: {
    skills: SKILLS,
    regions: DEYANG_REGIONS,
    modes: MODES,
    form: {
      learnerInfo: '',
      skill: SKILLS[0],
      mode: '线下',
      region: DEYANG_REGIONS[0],
      time: '',
      budgetMin: '',
      budgetMax: '',
      location: '',
      note: ''
    }
  },

  updateField(event) {
    const key = event.currentTarget.dataset.key;
    this.setData({ [`form.${key}`]: event.detail.value });
  },

  pickField(event) {
    const key = event.currentTarget.dataset.key;
    const options = this.data[`${key}s`];
    this.setData({ [`form.${key}`]: options[Number(event.detail.value)] });
  },

  submit() {
    const result = validateDemandInput(this.data.form);
    if (!result.ok) {
      wx.showToast({ title: result.errors[0], icon: 'none' });
      return;
    }
    api.createDemand(result.value)
      .then(() => {
        wx.showToast({ title: '已发布' });
        wx.switchTab({ url: '/pages/discover/discover' });
      })
      .catch(() => wx.showToast({ title: '发布失败，请检查云环境', icon: 'none' }));
  }
});
