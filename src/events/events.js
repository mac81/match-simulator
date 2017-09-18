const GOALKEEPER_EVENTS = {
  GOAL_KICK: 'goal-kick',
  SHORT_THROW: 'short-throw',
  LONG_KICK: 'long-kick'
};

export const EVENTS = {
  ...GOALKEEPER_EVENTS,
  SHORTPASS: 'shortpass',
  THROUGHBALL: 'throughball',
  LONGPASS: 'longpass',
  DRIBBLE: 'dribble',
  HEADER: 'header',
  KICKOFF: 'kickoff',
  SHOT: 'shot',
  GOAL: 'goal',
  SHOT_OFF_TARGET: 'shot-off-target',
  SHOT_ON_TARGET: 'shot-on-target'
};

export const RESULTS = {
  SUCCESSFUL: 'successful',
  FAILED: 'failed',
  INTERCEPTED: 'intercepted',
  GOAL: 'goal'
};