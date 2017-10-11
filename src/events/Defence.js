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
        return this.longPass();
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

  longPass() {
    const formation = this.attemptingTeam.formation[1] + this.attemptingTeam.formation[2];
    const passTo = random(formation);

    if (passTo <= this.attemptingTeam.formation[2]) {
      return this.longPassToMidfield();
    } else {
      return this.longPassToOffence();
    }
  }

  shortPassToDefence() {
    const attackStats = (this.attemptingTeam.defence.passing + this.attemptingTeam.defence.positioning) / 2;
    const defenceStats = this.oppositionTeam.defence.positioning;

    const attackProbability = convertRange(attackStats - defenceStats, [-100, 100], [85, 95]);

    if (attackProbability > random(100)) {
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
    } else {
      return {
        key: DEFENCE_EVENTS.SHORT_PASS,
        result: RESULTS.INTERCEPTED,
        from: ZONES.DEFENCE,
        to: ZONES.DEFENCE,
        switchTeams: true,
        logKey: 'passing',
        teams: {
          attempt: this.attemptingTeam,
          opponent: this.oppositionTeam,
        },
      };
    }
  }

  shortPassToMidfield() {
    const attackStats = (this.attemptingTeam.defence.passing + this.attemptingTeam.midfield.positioning) / 2;
    const defenceStats = (this.oppositionTeam.defence.positioning + this.oppositionTeam.midfield.positioning) / 2;

    const attackProbability = convertRange(attackStats - defenceStats, [-100, 100], [70, 90]);

    if (attackProbability > random(100)) {
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
    } else {
      return {
        key: DEFENCE_EVENTS.SHORT_PASS,
        result: RESULTS.INTERCEPTED,
        from: ZONES.DEFENCE,
        to: ZONES.MIDFIELD,
        switchTeams: true,
        logKey: 'passing',
        teams: {
          attempt: this.attemptingTeam,
          opponent: this.oppositionTeam,
        },
      };
    }
  }

  longPassToMidfield() {
    const attackStats = (this.attemptingTeam.defence.passing + this.attemptingTeam.midfield.positioning) / 2;
    const defenceStats = this.oppositionTeam.midfield.positioning;

    const attackProbability = convertRange(attackStats - defenceStats, [-100, 100], [40, 60]);

    if (attackProbability > random(100)) {
      return {
        key: DEFENCE_EVENTS.LONG_PASS,
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
    } else {
      return {
        key: DEFENCE_EVENTS.LONG_PASS,
        result: RESULTS.INTERCEPTED,
        from: ZONES.DEFENCE,
        to: ZONES.MIDFIELD,
        switchTeams: true,
        logKey: 'passing',
        teams: {
          attempt: this.attemptingTeam,
          opponent: this.oppositionTeam,
        },
      };
    }
  }

  longPassToOffence() {
    const attackStats = (this.attemptingTeam.defence.passing + this.attemptingTeam.offence.positioning) / 2;
    const defenceStats = this.oppositionTeam.defence.positioning;

    const attackProbability = convertRange(attackStats - defenceStats, [-100, 100], [20, 40]);

    if (attackProbability > random(100)) {
      return {
        key: DEFENCE_EVENTS.LONG_PASS,
        result: RESULTS.SUCCESSFUL,
        from: ZONES.DEFENCE,
        to: ZONES.OFFENCE,
        switchTeams: false,
        logKey: 'passing',
        teams: {
          attempt: this.attemptingTeam,
          opponent: this.oppositionTeam,
        },
      };
    } else {
      return {
        key: DEFENCE_EVENTS.LONG_PASS,
        result: RESULTS.INTERCEPTED,
        from: ZONES.DEFENCE,
        to: ZONES.OFFENCE,
        switchTeams: true,
        logKey: 'passing',
        teams: {
          attempt: this.attemptingTeam,
          opponent: this.oppositionTeam,
        },
      };
    }
  }
}
