import {random, convertRange} from '../utils/utils';
import {DEFENCE_EVENTS, RESULTS, ZONES, getRandomEvent} from './events';

export class DefenceEvents {
  constructor(simulator) {
    this.simulator = simulator;
  }

  simulate(prevEvent) {
    this.attemptingTeam = this.simulator.getAttemptTeam();
    this.oppositionTeam = this.simulator.getOppositionTeam();

    const event = getRandomEvent(DEFENCE_EVENTS);

    switch (event) {
      case DEFENCE_EVENTS.SHORT_PASS:
        return this.shortPass();
      case DEFENCE_EVENTS.LONG_PASS:
        return this.shortPass();
    }
  }

  shortPass() {
    const formation = this.attemptingTeam.formation[0] + this.attemptingTeam.formation[1];
    const passTo = random(formation);

    if (passTo <= this.attemptingTeam.formation[1]) {
      return this.shortPassToDefence();
    } else {
      return this.shortPassToMidfield();
    }
  }

  shortPassToDefence() {
    return {
      key: DEFENCE_EVENTS.SHORT_PASS,
      result: RESULTS.SUCCESSFUL,
      from: ZONES.DEFENCE,
      to: ZONES.DEFENCE,
      switchTeams: false,
      logKey: 'passing',
      teams: {
        attempt: this.attemptingTeam,
        opponent: this.oppositionTeam,
      },
    };
  }

  shortPassToMidfield() {
    return {
      key: DEFENCE_EVENTS.SHORT_PASS,
      result: RESULTS.SUCCESSFUL,
      from: ZONES.DEFENCE,
      to: ZONES.MIDFIELD,
      switchTeams: false,
      logKey: 'passing',
      teams: {
        attempt: this.attemptingTeam,
        opponent: this.oppositionTeam,
      },
    };
  }
}
