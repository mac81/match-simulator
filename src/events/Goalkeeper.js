import {
  GOALKEEPER_EVENTS,
  SPECIAL_EVENTS,
  RESULTS,
  ZONES,
  getRandomEvent,
} from './events';

export class GoalkeeperEvents {
  constructor(simulator) {
    this.simulator = simulator;
  }

  simulate(prevEvent) {
    this.attemptingTeam = this.simulator.getAttemptTeam();
    this.oppositionTeam = this.simulator.getOppositionTeam();

    let event = {};

    if (prevEvent || prevEvent.result === RESULTS.GOAL_KICK) {
      event = SPECIAL_EVENTS.GOAL_KICK;
    } else {
      event = getRandomEvent(GOALKEEPER_EVENTS);
    }

    switch (event) {
      case GOALKEEPER_EVENTS.SHORT_THROW:
      case GOALKEEPER_EVENTS.LONG_KICK:
        return this.shortThrow();
      case SPECIAL_EVENTS.GOAL_KICK:
        return this.goalKick();
    }
  }

  shortThrow() {
    return {
      key: GOALKEEPER_EVENTS.SHORT_THROW,
      result: RESULTS.SUCCESSFUL,
      from: ZONES.GOALKEEPER,
      to: ZONES.DEFENCE,
      switchTeams: false,
      teams: {
        attempt: this.attemptingTeam,
        opponent: this.oppositionTeam,
      },
    };
  }

  goalKick() {
    return {
      key: SPECIAL_EVENTS.GOAL_KICK,
      result: RESULTS.SUCCESSFUL,
      from: ZONES.GOALKEEPER,
      to: ZONES.DEFENCE,
      switchTeams: false,
      teams: {
        attempt: this.attemptingTeam,
        opponent: this.oppositionTeam,
      },
    };
  }
}
