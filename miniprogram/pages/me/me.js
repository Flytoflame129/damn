Page({
  data: {
    role: 'learner',
    user: null
  },

  onShow() {
    const app = getApp();
    this.setData({
      role: app.globalData.role || 'learner',
      user: app.globalData.user
    });
  },

  switchRole(event) {
    const role = event.currentTarget.dataset.role;
    getApp().setRole(role);
    this.setData({ role });
    wx.showToast({ title: role === 'learner' ? '学习方视角' : '达人视角' });
  },

  editProfile() {
    wx.navigateTo({ url: '/pages/profile-edit/profile-edit' });
  }
});
