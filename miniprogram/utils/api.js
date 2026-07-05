function call(action, data) {
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name: 'api',
      data: Object.assign({ action }, data || {}),
      success: res => resolve(res.result),
      fail: reject
    });
  });
}

module.exports = {
  login: () => call('login', {}),
  listMarket: data => call('listMarket', data),
  createDemand: data => call('createDemand', data),
  saveTutorProfile: data => call('saveTutorProfile', data),
  applyDemand: data => call('applyDemand', data),
  submitVerification: data => call('submitVerification', data),
  listMessages: data => call('listMessages', data),
  sendMessage: data => call('sendMessage', data)
};
