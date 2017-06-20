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

    const shotOptions = {
      'on-target': 0.5,
      'off-target': 0.5
    };

    const shotOutcome = weighted.select(shotOptions);

    let resultOptions;

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
      teams: {
        attempt: attackingTeam,
        opponent: defendingTeam
      },
      attempt: {
        type: `${shotOutcome}-shot`,
        from: 'offence',
        to: 'offence'
      },
      result: {
        type: resultOutcome,
        switchTeams: true
      }
    }
  }
}
