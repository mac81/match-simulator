import {random, convertRange} from '../utils/utils';
import {GOALKEEPER_EVENTS, SPECIAL_EVENTS, RESULTS, ZONES, getRandomEvent} from './events';

export class GoalkeeperEvents {
  constructor(simulator) {
    this.simulator = simulator;
  }

  simulate(prevEvent) {
    this.attemptingTeam = this.simulator.getAttemptTeam();
    this.oppositionTeam = this.simulator.getOppositionTeam();

    let event = {};

    if (!prevEvent || prevEvent.result === RESULTS.GOAL_KICK) {
      event = SPECIAL_EVENTS.GOAL_KICK;
    } else {
      event = getRandomEvent(GOALKEEPER_EVENTS);
    }

    switch (event) {
      case GOALKEEPER_EVENTS.SHORT_THROW:
        return this.shortThrow();
      case GOALKEEPER_EVENTS.LONG_THROW:
        return this.longThrow();
      case GOALKEEPER_EVENTS.SHORT_PASS:
        return this.shortPass();
      case GOALKEEPER_EVENTS.LONG_PASS:
        return this.longPass();
      case SPECIAL_EVENTS.GOAL_KICK:
        return this.goalKick();
    }
  }

  shortThrow() {
    const attemptStats = this.attemptingTeam.gk.throwing;
    const oppositionStats = this.oppositionTeam.offence.positioning;

    const successProbability = convertRange(attemptStats - oppositionStats, [-100, 100], [90, 100]);

    if (successProbability > random(100)) {
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
    } else {
      return {
        key: GOALKEEPER_EVENTS.SHORT_THROW,
        result: RESULTS.FAILED,
        from: ZONES.GOALKEEPER,
        to: ZONES.DEFENCE,
        switchTeams: true,
        teams: {
          attempt: this.attemptingTeam,
          opponent: this.oppositionTeam,
        },
      };
    }
  }

  longThrow() {
    const attemptStats = this.attemptingTeam.gk.throwing;
    const oppositionStats = this.oppositionTeam.offence.positioning;

    const successProbability = convertRange(attemptStats - oppositionStats, [-100, 100], [85, 100]);

    if (successProbability > random(100)) {
      return {
        key: GOALKEEPER_EVENTS.LONG_THROW,
        result: RESULTS.SUCCESSFUL,
        from: ZONES.GOALKEEPER,
        to: ZONES.MIDFIELD,
        switchTeams: false,
        teams: {
          attempt: this.attemptingTeam,
          opponent: this.oppositionTeam,
        },
      };
    } else {
      return {
        key: GOALKEEPER_EVENTS.LONG_THROW,
        result: RESULTS.FAILED,
        from: ZONES.GOALKEEPER,
        to: ZONES.MIDFIELD,
        switchTeams: false,
        teams: {
          attempt: this.attemptingTeam,
          opponent: this.oppositionTeam,
        },
      };
    }
  }

  shortPass() {
    return {
      key: GOALKEEPER_EVENTS.SHORT_PASS,
      result: RESULTS.SUCCESSFUL,
      from: ZONES.GOALKEEPER,
      to: ZONES.DEFENCE,
      switchTeams: false,
      logKey: 'passing',
      teams: {
        attempt: this.attemptingTeam,
        opponent: this.oppositionTeam,
      },
    };
  }

  longPass() {
    return {
      key: GOALKEEPER_EVENTS.LONG_PASS,
      result: RESULTS.SUCCESSFUL,
      from: ZONES.GOALKEEPER,
      to: ZONES.MIDFIELD,
      switchTeams: false,
      logKey: 'passing',
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
