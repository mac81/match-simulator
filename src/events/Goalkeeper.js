import {EVENTS, RESULTS} from './events';
import { random } from '../utils/utils';

const GOALKEEPER_EVENTS = {
  0: EVENTS.SHORT_THROW,
  1: EVENTS.LONG_KICK,
  2: EVENTS.GOAL_KICK
};

export class GoalkeeperEvents {

  constructor(home, away) {
    this.hometeam = home;
    this.awayteam = away;
  }

  simulate(teamInPossesion, prevEvent) {
    this.teamInPossesion = teamInPossesion;
    let event = {};

    if(prevEvent || prevEvent.result === RESULTS.GOAL_KICK) {
      event = GOALKEEPER_EVENTS[2]
    } else {
      event = GOALKEEPER_EVENTS[random(2)]
    }


    switch(event) {
    case EVENTS.SHORT_THROW:
    case EVENTS.LONG_KICK:
      return this.shortThrow();
    case EVENTS.GOAL_KICK:
      return this.goalKick();
    }
  }

  shortThrow() {
    return {
      key: EVENTS.SHORT_THROW,
      result: RESULTS.SUCCESSFUL,
      from: 'goalkeeper',
      to: 'defence',
      switchTeams: false,
      teams: {
        attempt: this.teamInPossesion === 0 ? this.hometeam : this.awayteam,
        opponent: this.teamInPossesion === 0 ? this.awayteam : this.hometeam
      }
    }
  }

  goalKick() {
    return {
      key: EVENTS.GOAL_KICK,
      result: RESULTS.SUCCESSFUL,
      from: 'goalkeeper',
      to: 'defence',
      switchTeams: false,
      teams: {
        attempt: this.teamInPossesion === 0 ? this.hometeam : this.awayteam,
        opponent: this.teamInPossesion === 0 ? this.awayteam : this.hometeam
      }
    }
  }
}
