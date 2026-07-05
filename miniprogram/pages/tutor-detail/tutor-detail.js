const api = require('../../utils/api');
const seed = require('../../shared/seed');
const { COMMISSION_RATES } = require('../../shared/constants');

Page({
  data: {
    tutor: null,
    onlineFee: 0,
    offlineFee: 0
  },

  onLoad(query) {
    const tutor = seed.tutors.find(item => item._id === query.id);
    if (tutor) this.setTutor(tutor);
    api.listMarket({})
      .then(result => {
        const remoteTutor = (result.tutors || []).find(item => item._id === query.id);
        if (remoteTutor) this.setTutor(remoteTutor);
      })
      .catch(() => {});
  },

  setTutor(tutor) {
    this.setData({
      tutor,
      onlineFee: Math.round(tutor.price * COMMISSION_RATES['线上']),
      offlineFee: Math.round(tutor.price * COMMISSION_RATES['线下'])
    });
  }
});
