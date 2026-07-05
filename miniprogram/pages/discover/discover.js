const api = require('../../utils/api');
const { SKILLS } = require('../../shared/constants');
const seed = require('../../shared/seed');

Page({
  data: {
    role: 'learner',
    skills: ['全部'].concat(SKILLS),
    activeSkill: '全部',
    tutors: [],
    demands: [],
    loading: true
  },

  onShow() {
    this.setData({ role: getApp().globalData.role || 'learner' });
    this.loadMarket();
  },

  loadMarket() {
    this.setData({ loading: true });
    api.listMarket({ skill: this.data.activeSkill })
      .then(result => {
        this.setData({
          tutors: result.tutors || [],
          demands: result.demands || [],
          loading: false
        });
      })
      .catch(() => {
        this.setData({
          tutors: seed.tutors,
          demands: seed.demands,
          loading: false
        });
      });
  },

  selectSkill(event) {
    this.setData({ activeSkill: event.currentTarget.dataset.skill });
    this.loadMarket();
  },

  openTutor(event) {
    wx.navigateTo({ url: `/pages/tutor-detail/tutor-detail?id=${event.currentTarget.dataset.id}` });
  },

  openDemand(event) {
    wx.navigateTo({ url: `/pages/demand-detail/demand-detail?id=${event.currentTarget.dataset.id}` });
  }
});
