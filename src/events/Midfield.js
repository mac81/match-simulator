import weighted from 'weighted';
import {random, convertRange} from '../utils/utils';
import Simulator from '../classes/Simulator';
import {EVENTS, MIDFIELD_EVENTS, SPECIAL_EVENTS, RESULTS, ZONES, getRandomEvent} from './events';

export class MidfieldEvents {
  constructor(simulator) {
    this.simulator = simulator;
  }

  simulate(prevEvent) {
    this.attemptingTeam = this.simulator.getAttemptTeam();
    this.oppositionTeam = this.simulator.getOppositionTeam();
    let event = {};

    if (!prevEvent || prevEvent.result === RESULTS.GOAL) {
      event = SPECIAL_EVENTS.KICKOFF;
    } else if (prevEvent.key === EVENTS.LONG_PASS) {
      // TODO: Set to header, reception, free ball etc
      event = getRandomEvent([MIDFIELD_EVENTS.HEADER]);
    } else {
      event = getRandomEvent(MIDFIELD_EVENTS); //TODO: Make certain eventtypes happen more regularly
    }

    switch (event) {
      case SPECIAL_EVENTS.KICKOFF:
        return this.kickoff();
      case MIDFIELD_EVENTS.SHORT_PASS:
        return this.shortPass();
      case MIDFIELD_EVENTS.DRIBBLE:
        return this.dribble();
      case MIDFIELD_EVENTS.HEADER:
        return this.header();
      case MIDFIELD_EVENTS.LONG_PASS:
        return this.shortPass(); //TODO: Set correct method
      case MIDFIELD_EVENTS.THROUGH_BALL:
        return this.throughBall();
    }
  }

  shortPassToDefence() {
    const attemptStats = (this.attemptingTeam.midfield.passing + this.attemptingTeam.defence.positioning) / 2;
    const oppositionStats = (this.oppositionTeam.midfield.positioning + this.oppositionTeam.offence.positioning) / 2;

    const successProbability = convertRange(attemptStats - oppositionStats, [-100, 100], [70, 90]);

    if (successProbability > random(100)) {
      return {
        key: MIDFIELD_EVENTS.SHORT_PASS,
        result: RESULTS.SUCCESSFUL,
        from: ZONES.MIDFIELD,
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
        key: MIDFIELD_EVENTS.SHORT_PASS,
        result: RESULTS.INTERCEPTED,
        from: ZONES.MIDFIELD,
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
    const attackStats = (this.attemptingTeam.midfield.passing + this.attemptingTeam.midfield.positioning) / 2;
    const defenceStats = this.oppositionTeam.midfield.positioning;

    const attackProbability = convertRange(attackStats - defenceStats, [-100, 100], [70, 90]);

    if (attackProbability > random(100)) {
      if (attackProbability <= 72) {
        return {
          key: MIDFIELD_EVENTS.SHORT_PASS,
          result: RESULTS.FAILED,
          from: ZONES.MIDFIELD,
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
          key: MIDFIELD_EVENTS.SHORT_PASS,
          result: RESULTS.SUCCESSFUL,
          from: ZONES.MIDFIELD,
          to: ZONES.MIDFIELD,
          switchTeams: false,
          logKey: 'passing',
          teams: {
            attempt: this.attemptingTeam,
            opponent: this.oppositionTeam,
          },
        };
      }
    } else {
      return {
        key: MIDFIELD_EVENTS.SHORT_PASS,
        result: RESULTS.INTERCEPTED,
        from: ZONES.MIDFIELD,
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

  shortPassToOffence() {
    const attackStats = this.attemptingTeam.midfield.passing + this.attemptingTeam.offence.positioning;
    const defenceStats = this.oppositionTeam.defence.positioning + this.oppositionTeam.midfield.positioning;

    const attackProbability = convertRange(attackStats - defenceStats, [-100, 100], [70, 90]);

    if (attackProbability > random(100)) {
      return {
        key: MIDFIELD_EVENTS.SHORT_PASS,
        result: RESULTS.SUCCESSFUL,
        from: ZONES.MIDFIELD,
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
        key: MIDFIELD_EVENTS.SHORT_PASS,
        result: RESULTS.INTERCEPTED,
        from: ZONES.MIDFIELD,
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

  kickoff() {
    return {
      key: SPECIAL_EVENTS.KICKOFF,
      result: RESULTS.SUCCESSFUL,
      from: ZONES.MIDFIELD,
      to: ZONES.MIDFIELD,
      switchTeams: false,
      teams: {
        attempt: this.attemptingTeam,
        opponent: this.oppositionTeam,
      },
    };
  }

  shortPass() {
    const formation =
      this.attemptingTeam.formation[0] + this.attemptingTeam.formation[1] + this.attemptingTeam.formation[2];
    const passTo = random(formation);

    if (passTo <= this.attemptingTeam.formation[0]) {
      return this.shortPassToDefence();
    } else if (passTo <= this.attemptingTeam.formation[0] + this.attemptingTeam.formation[1]) {
      return this.shortPassToMidfield();
    } else {
      return this.shortPassToOffence();
    }
  }

  throughBall() {
    const attackStats = this.attemptingTeam.midfield.passing + this.attemptingTeam.offence.positioning;
    const defenceStats = this.oppositionTeam.defence.positioning + this.oppositionTeam.midfield.positioning;

    const attackProbability = convertRange(attackStats - defenceStats, [-100, 100], [70, 90]);

    if (attackProbability > random(100)) {
      return {
        key: MIDFIELD_EVENTS.THROUGH_BALL,
        result: RESULTS.SUCCESSFUL,
        from: ZONES.MIDFIELD,
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
        key: MIDFIELD_EVENTS.THROUGH_BALL,
        result: RESULTS.INTERCEPTED,
        from: ZONES.MIDFIELD,
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

  dribble() {
    const attackStats = this.attemptingTeam.midfield.technique;
    const defenceStats = this.oppositionTeam.midfield.tackling;

    const attackProbability = convertRange(attackStats - defenceStats, [-100, 100], [50, 70]);

    if (attackProbability > random(100)) {
      return {
        key: MIDFIELD_EVENTS.DRIBBLE,
        result: RESULTS.SUCCESSFUL,
        from: ZONES.MIDFIELD,
        to: ZONES.OFFENCE,
        switchTeams: false,
        logKey: 'dribble',
        teams: {
          attempt: this.attemptingTeam,
          opponent: this.oppositionTeam,
        },
      };
    } else {
      return {
        key: MIDFIELD_EVENTS.DRIBBLE,
        result: RESULTS.TACKLED,
        from: ZONES.MIDFIELD,
        to: ZONES.MIDFIELD,
        switchTeams: true,
        logKey: 'dribble',
        teams: {
          attempt: this.attemptingTeam,
          opponent: this.oppositionTeam,
        },
      };
    }
  }

  header() {
    const attackStats = this.attemptingTeam.midfield.heading;
    const defenceStats = this.oppositionTeam.midfield.heading;

    const attackProbability = convertRange(attackStats - defenceStats, [-100, 100], [50, 70]);

    if (attackProbability > random(100)) {
      return {
        key: MIDFIELD_EVENTS.HEADER,
        result: RESULTS.SUCCESSFUL,
        from: ZONES.MIDFIELD,
        to: ZONES.MIDFIELD,
        switchTeams: false,
        logKey: 'header',
        teams: {
          attempt: this.attemptingTeam,
          opponent: this.oppositionTeam,
        },
      };
    } else {
      return {
        key: MIDFIELD_EVENTS.HEADER,
        result: RESULTS.FAILED,
        from: ZONES.MIDFIELD,
        to: ZONES.MIDFIELD,
        switchTeams: true,
        logKey: 'header',
        teams: {
          attempt: this.attemptingTeam,
          opponent: this.oppositionTeam,
        },
      };
    }
  }
}
