App({
  globalData: {
    user: null,
    role: 'learner',
    cloudReady: false
  },

  onLaunch() {
    if (wx.cloud) {
      wx.cloud.init({
        traceUser: true
      });
      this.globalData.cloudReady = true;
    }
    this.bootstrapUser();
  },

  bootstrapUser() {
    if (!this.globalData.cloudReady) return;
    const api = require('./utils/api');
    api.login()
      .then(result => {
        this.globalData.user = result.user;
        this.globalData.role = result.user.role || 'learner';
      })
      .catch(err => {
        console.warn('login failed', err);
      });
  },

  setRole(role) {
    this.globalData.role = role;
  }
});
