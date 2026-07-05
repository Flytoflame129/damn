const api = require('../../utils/api');
const seed = require('../../shared/seed');

Page({
  data: {
    demand: null,
    applying: false
  },

  onLoad(query) {
    const demand = seed.demands.find(item => item._id === query.id);
    if (demand) this.setData({ demand });
    api.listMarket({})
      .then(result => {
        const remoteDemand = (result.demands || []).find(item => item._id === query.id);
        if (remoteDemand) this.setData({ demand: remoteDemand });
      })
      .catch(() => {});
  },

  apply() {
    if (!this.data.demand || this.data.applying) return;
    this.setData({ applying: true });
    api.applyDemand({ demandId: this.data.demand._id })
      .then(() => {
        wx.showToast({ title: '已申请' });
        wx.switchTab({ url: '/pages/messages/messages' });
      })
      .catch(err => {
        wx.showToast({ title: err.message || '申请失败，请先完成认证', icon: 'none' });
        this.setData({ applying: false });
      });
  }
});
