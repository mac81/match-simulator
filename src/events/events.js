export const getRandomEvent = obj => {
  const keys = Object.keys(obj);
  return obj[keys[Math.floor(Math.random() * keys.length)]];
};

export const EVENTS = {
  GOAL_KICK: 'goal-kick',
  KICKOFF: 'kickoff',
  SHORT_THROW: 'short-throw',
  LONG_KICK: 'long-kick',
  SHORT_PASS: 'short-pass',
  LONG_PASS: 'long-pass',
  THROUGH_BALL: 'through-ball',
  DRIBBLE: 'dribble',
  HEADER: 'header',
  SHOT: 'shot',
  SHOT_ON_TARGET: 'shot-on-target',
  SHOT_OFF_TARGET: 'shot-off-target',
  TACKLE: 'tackle',
};

export const SPECIAL_EVENTS = {
  GOAL_KICK: EVENTS.GOAL_KICK,
  KICKOFF: EVENTS.KICKOFF,
  TACKLE: EVENTS.TACKLE,
};

export const GOALKEEPER_EVENTS = {
  SHORT_THROW: EVENTS.SHORT_THROW,
  LONG_KICK: EVENTS.LONG_KICK,
};

export const DEFENCE_EVENTS = {
  SHORT_PASS: EVENTS.SHORT_PASS,
  LONG_PASS: EVENTS.LONG_PASS,
};

export const MIDFIELD_EVENTS = {
  SHORT_PASS: EVENTS.SHORT_PASS,
  THROUGH_BALL: EVENTS.THROUGH_BALL,
  LONG_PASS: EVENTS.LONG_PASS,
  DRIBBLE: EVENTS.DRIBBLE,
  HEADER: EVENTS.HEADER,
};

export const OFFENCE_EVENTS = {
  SHORT_PASS: EVENTS.SHORT_PASS,
  DRIBBLE: EVENTS.DRIBBLE,
  SHOT: EVENTS.SHOT,
  SHOT_ON_TARGET: EVENTS.SHOT_ON_TARGET,
  SHOT_OFF_TARGET: EVENTS.SHOT_OFF_TARGET,
};

export const PASSING_EVENTS = {
  SHORT_PASS: EVENTS.SHORT_PASS,
  THROUGH_BALL: EVENTS.THROUGH_BALL,
  LONG_PASS: EVENTS.LONG_PASS,
};

export const DRIBBLE_EVENTS = {
  DRIBBLE: EVENTS.DRIBBLE,
};

export const SHOT_EVENTS = {
  SHOT_ON_TARGET: EVENTS.SHOT_ON_TARGET,
  SHOT_OFF_TARGET: EVENTS.SHOT_OFF_TARGET,
};

// export const EVENTS = {
//   ...GOALKEEPER_EVENTS,
//   SHORTPASS: 'shortpass',
//   THROUGHBALL: 'throughball',
//   LONGPASS: 'longpass',
//   DRIBBLE: 'dribble',
//   HEADER: 'header',
//   KICKOFF: 'kickoff',
//   SHOT: 'shot',
//   GOAL: 'goal',
//   SHOT_OFF_TARGET: 'shot-off-target',
//   SHOT_ON_TARGET: 'shot-on-target'
// };

export const RESULTS = {
  SUCCESSFUL: 'successful',
  FAILED: 'failed',
  INTERCEPTED: 'intercepted',
  GOAL: 'goal',
  SAVE: 'save',
  TACKLED: 'tackled',
  GOAL_KICK: EVENTS.GOAL_KICK,
};

export const ZONES = {
  GOALKEEPER: 'goalkeeper',
  DEFENCE: 'defence',
  MIDFIELD: 'midfield',
  OFFENCE: 'offence',
};
