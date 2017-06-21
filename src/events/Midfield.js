import weighted from 'weighted';

const MIDFIELD_EVENTS = {
  0: 'shortpass',
  1: 'longpass',
  2: 'dribble',
  3: 'header',
  4: 'kickoff'
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

    if(prevEvent.key === 'kickoff') {
      event = 'shortpass'//MIDFIELD_EVENTS[eventId];
    } else {
      event = 'shortpass'//MIDFIELD_EVENTS[eventId];
    }

    switch(event) {
    case 'shortpass':
      return this.shortpass();
    }
  }

  passToMidfield() {
    const attackingTeam = this.getAttackingTeam();
    const defendingTeam = this.getDefendingTeam();

    // const modifier = {
    //   'attack': 0.7,
    //   'defence': 0.3
    // };
    //
    // const weightedModifier = weighted.select(probability);

    const attackProbability = (attackingTeam.midfield.passing + attackingTeam.midfield.positioning + (Math.floor(Math.random() * 20) + 1) - 20);
    const defenceProbability = (defendingTeam.midfield.positioning + defendingTeam.midfield.tackling + (Math.floor(Math.random() * 10) + 1) - 10);

    if(attackProbability > defenceProbability) {
      const successProbability = attackingTeam.midfield.passing + Math.floor(Math.random() * 20) + 1;
      const failureProbability = attackingTeam.midfield.positioning + Math.floor(Math.random() * 5) + 1;
      if(successProbability > failureProbability) {
        return {
          key: 'shortpass',
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
          key: 'shortpass',
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
        key: 'shortpass',
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

  shortpass() {
    const attackingTeam = this.getAttackingTeam();
    const defendingTeam = this.getDefendingTeam();

    const attackStatPoints = attackingTeam.formation[1] + attackingTeam.formation[2];
    const passTo = Math.floor(Math.random() * attackStatPoints) + 1;

    if(passTo <= 4) {
      return this.passToMidfield();
    } else {
      const attackProbability = attackingTeam.midfield.passing + attackingTeam.offence.passing + Math.floor(Math.random() * 10) + 1;
      const defenceProbability = defendingTeam.defence.positioning + defendingTeam.midfield.positioning + Math.floor(Math.random() * 10) + 1;

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
  }
}
