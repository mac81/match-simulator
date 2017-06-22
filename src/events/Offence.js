import weighted from 'weighted';

const ATTACK_EVENTS = {
  0: 'shortpass',
  1: 'dribble',
  2: 'shot',
  3: 'header'
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

  simulate(teamInPossesion) {
    this.teamInPossesion = teamInPossesion;

    const eventId = Math.floor(Math.random() * 4) + 1;
    const eventType = 'shot'//MIDFIELD_EVENTS[eventId];

    switch(eventType) {
    case 'shot':
      return this.shot();
    }
  }

  shot() {
    const attackingTeam = this.getAttackingTeam();
    const defendingTeam = this.getDefendingTeam();

    const rand = (Math.floor(Math.random() * 20) + 1);
    const onTarget = attackingTeam.offence.finishing - rand;
    const offTarget = 100 - onTarget;

    const shotOptions = {
      'on-target': onTarget / 100,
      'off-target': offTarget / 100
    };

    const shotOutcome = weighted.select(shotOptions);

    let resultOptions;

    // const rand = (Math.floor(Math.random() * 20) + 1);
    // const attacker = attackingTeam.offence.finishing - rand; // 40
    // const goalkeeper = defendingTeam.gk - rand; // 45

    if(shotOutcome === 'on-target') {
      resultOptions = {
        'goal': 0.5,
        'save': 0.5
      };
    } else {
      resultOptions = {
        'goalkick': 1
      };
    }

    const resultOutcome = weighted.select(resultOptions);

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
}
