import weighted from 'weighted';
import { random } from '../utils/utils';
import { EVENTS as events } from './events';

const OFFENCE_EVENTS = {
  1: events.SHORTPASS,
  2: events.DRIBBLE,
  3: events.SHOT
};

export class OffenceEvents {

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

    let eventType;
    if(prevEvent.key === events.SHORTPASS) {
      //TODO: Calculate if event should be shortpass, flick, dribble etc based on offence skills vs defence skills
      eventType = OFFENCE_EVENTS[random(2)];
    } else {
      eventType = OFFENCE_EVENTS[3];
    }

    switch(eventType) {
    case events.SHORTPASS:
      return this.dribble();
    case events.DRIBBLE:
      return this.dribble();
    case events.SHOT:
      return this.shot();
    }
  }

  shot() {
    const attackingTeam = this.getAttackingTeam();
    const defendingTeam = this.getDefendingTeam();

    const onTarget = attackingTeam.offence.finishing - random(20);
    const offTarget = 100 - onTarget;

    const shotOptions = {
      'on-target': onTarget / 100,
      'off-target': offTarget / 100
    };

    const shotOutcome = weighted.select(shotOptions);

    let resultOutcome;

    if(shotOutcome === 'on-target') {
      const attacker = attackingTeam.offence.finishing - random(20);
      const goalkeeper = defendingTeam.gk - random(20);

      resultOutcome = attacker > goalkeeper ? 'goal' : 'save';
    } else {
      resultOutcome = 'goalkick';
    }

    return {
      key: `shot-${shotOutcome}`,
      result: resultOutcome,
      from: 'offence',
      to: 'offence',
      switchTeams: true,
      teams: {
        attempt: attackingTeam,
        opponent: defendingTeam
      }
    }
  }

  dribble() {
    const attackingTeam = this.getAttackingTeam();
    const defendingTeam = this.getDefendingTeam();

    const attackProbability = attackingTeam.offence.technique - random(20);
    const defenceProbability = defendingTeam.defence.tackling - random(20);

    if(attackProbability > defenceProbability) {
      return {
        key: `dribble`,
        result: 'success',
        from: 'offence',
        to: 'offence',
        switchTeams: false,
        teams: {
          attempt: attackingTeam,
          opponent: defendingTeam
        }
      }
    } else {
      return {
        key: 'dribble',
        result: 'fail',
        from: 'offence',
        to: 'offence',
        switchTeams: true,
        teams: {
          attempt: attackingTeam,
          opponent: defendingTeam
        }
      }
    }
  }
}
