import weighted from 'weighted';
import { random } from '../utils/utils';
import {EVENTS, RESULTS} from './events';

const MIDFIELD_EVENTS = {
  1: EVENTS.SHORTPASS,
  2: EVENTS.THROUGHBALL,
  3: EVENTS.LONGPASS,
  4: EVENTS.DRIBBLE,
  5: EVENTS.HEADER,
  6: EVENTS.KICKOFF
};

export class MidfieldEvents {

  constructor(home, away) {
    this.hometeam = home;
    this.awayteam = away;
  }

  getAttackingTeam() {
    return this.teamInPossession === 0 ? this.hometeam : this.awayteam;
  }

  getDefendingTeam() {
    return this.teamInPossession === 0 ? this.awayteam : this.hometeam;
  }

  simulate(teamInPossession, prevEvent) {
    this.teamInPossession = teamInPossession;
    let event = {};

    if(!prevEvent || prevEvent.result === RESULTS.GOAL) {
      event = MIDFIELD_EVENTS[6]
    } else {
      event = MIDFIELD_EVENTS[random(2)]
    }

    switch(event) {
    case EVENTS.KICKOFF:
      return this.kickoff();
    case EVENTS.SHORTPASS:
      return this.shortpass();
    case EVENTS.THROUGHBALL:
      return this.throughball();
    }
  }

  shortpassToMidfield() {
    const attackingTeam = this.getAttackingTeam();
    const defendingTeam = this.getDefendingTeam();

    const attackProbability = ((attackingTeam.midfield.passing + attackingTeam.midfield.positioning) / 2) - random(20);
    const defenceProbability = (defendingTeam.midfield.positioning) - random(20);

    if(attackProbability > defenceProbability) {
      const successProbability = attackingTeam.midfield.passing + random(20);
      const failureProbability = attackingTeam.midfield.positioning + random(5);
      if(successProbability > failureProbability) {
        return {
          key: EVENTS.SHORTPASS,
          result: RESULTS.SUCCESSFUL,
          from: 'midfield',
          to: 'midfield',
          switchTeams: false,
          teams: {
            attempt: attackingTeam,
            opponent: defendingTeam
          }
        }
      } else {
        return {
          key: EVENTS.SHORTPASS,
          result: RESULTS.FAILED,
          from: 'midfield',
          to: 'midfield',
          switchTeams: true,
          teams: {
            attempt: attackingTeam,
            opponent: defendingTeam
          }
        }
      }
    } else {
      return {
        key: EVENTS.SHORTPASS,
        result: RESULTS.INTERCEPTED,
        from: 'midfield',
        to: 'midfield',
        switchTeams: true,
        teams: {
          attempt: attackingTeam,
          opponent: defendingTeam
        }
      }
    }
  }

  shortpassToOffence() {
    const attackingTeam = this.getAttackingTeam();
    const defendingTeam = this.getDefendingTeam();

    const attackProbability = attackingTeam.midfield.passing + attackingTeam.offence.positioning + random(10);
    const defenceProbability = defendingTeam.defence.positioning + defendingTeam.midfield.positioning + random(10);

    if(attackProbability > defenceProbability) {
      return {
        key: EVENTS.SHORTPASS,
        result: RESULTS.SUCCESSFUL,
        from: 'midfield',
        to: 'offence',
        switchTeams: false,
        teams: {
          attempt: attackingTeam,
          opponent: defendingTeam
        }
      }
    } else {
      return {
        key: EVENTS.SHORTPASS,
        result: RESULTS.INTERCEPTED,
        from: 'midfield',
        to: 'offence',
        switchTeams: true,
        teams: {
          attempt: attackingTeam,
          opponent: defendingTeam
        }
      }
    }
  }

  kickoff() {
    const attackingTeam = this.getAttackingTeam();
    const defendingTeam = this.getDefendingTeam();

    return {
      key: EVENTS.KICKOFF,
      result: RESULTS.SUCCESSFUL,
      from: 'midfield',
      to: 'midfield',
      switchTeams: false,
      teams: {
        attempt: attackingTeam,
        opponent: defendingTeam
      }
    }
  }

  shortpass() {
    const attackingTeam = this.getAttackingTeam();

    const attackStatPoints = attackingTeam.formation[1] + attackingTeam.formation[2];
    const passTo = random(attackStatPoints);

    if(passTo <= 4) {
      return this.shortpassToMidfield();
    } else {
      return this.shortpassToOffence();
    }
  }

  throughball() {
    const attackingTeam = this.getAttackingTeam();
    const defendingTeam = this.getDefendingTeam();

    return {
      key: EVENTS.THROUGHBALL,
      result: RESULTS.SUCCESSFUL,
      from: 'midfield',
      to: 'offence',
      switchTeams: false,
      teams: {
        attempt: attackingTeam,
        opponent: defendingTeam
      }
    }
  }
}
