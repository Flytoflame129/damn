const TRANSITIONS = {
  pending: {
    learner_accept: 'matched',
    learner_reject: 'rejected',
    tutor_cancel: 'cancelled'
  },
  matched: {
    complete: 'completed',
    cancel: 'cancelled'
  }
};

function nextApplicationState(application, event) {
  const current = application && application.status;
  const next = TRANSITIONS[current] && TRANSITIONS[current][event];
  if (!next) {
    throw new Error(`Invalid application transition: ${current} -> ${event}`);
  }
  return next;
}

module.exports = { nextApplicationState };
