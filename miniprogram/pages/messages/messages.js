const api = require('../../utils/api');

Page({
  data: {
    conversations: [],
    loading: true
  },

  onShow() {
    api.listMessages({})
      .then(result => this.setData({ conversations: result.conversations || [], loading: false }))
      .catch(() => this.setData({ conversations: [], loading: false }));
  }
});
