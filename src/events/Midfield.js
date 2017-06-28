import weighted from 'weighted';
import { random } from '../utils/utils';
import { EVENTS as events } from './events';

const MIDFIELD_EVENTS = {
  1: events.SHORTPASS,
  2: events.THROUGHBALL,
  3: events.LONGPASS,
  4: events.DRIBBLE,
  5: events.HEADER,
  6: events.KICKOFF
};

export class MidfieldEvents {

  constructor(home, away) {
    this.hometeam = home;
    this.awayteam = away;
  }

  getAttackingTeam() {
    return this.teamInPossesion === 0 ? this.hometeam : this.awayteam;
  }

  getDefendingTeam() {
    return this.teamInPossesion === 0 ? this.awayteam : this.hometeam;
  }

  simulate(teamInPossesion, prevEvent) {
    this.teamInPossesion = teamInPossesion;
    this.prevEvent = prevEvent;
    let event = {};

    const eventId = Math.floor(Math.random() * 4) + 1;

    if(prevEvent.key === events.KICKOFF) {
      event = 'shortpass'//MIDFIELD_EVENTS[eventId];
    } else {
      event = MIDFIELD_EVENTS[random(2)]
    }

    switch(event) {
    case events.SHORTPASS:
      return this.shortpass();
    case events.THROUGHBALL:
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
          key: events.SHORTPASS,
          result: 'success',
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
          key: events.SHORTPASS,
          result: 'fail',
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
        key: events.SHORTPASS,
        result: 'intercept',
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
        key: 'shortpass',
        result: 'success',
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
        key: 'shortpass',
        result: 'intercept',
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
      key: 'throughball',
      result: 'success',
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
