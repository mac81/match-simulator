const DEFENCE_EVENTS = {
  0: 'shortpass',
  1: 'longpass'
};

export class DefenceEvents {

  constructor(home, away) {
    this.hometeam = home;
    this.awayteam = away;
  }

  simulate(teamInPossesion) {
    this.teamInPossesion = teamInPossesion;

    const eventId = Math.floor(Math.random() * 4) + 1;
    const eventType = 'shortpass'//MIDFIELD_EVENTS[eventId];

    switch(eventType) {
    case 'shortpass':
      return this.shortpass();
    }
  }

  shortpass() {
    return {
      key: 'shortpass',
      result: 'success',
      from: 'defence',
      to: 'midfield',
      switchTeams: false,
      teams: {
        attempt: this.teamInPossesion === 0 ? this.hometeam : this.awayteam,
        opponent: this.teamInPossesion === 0 ? this.awayteam : this.hometeam
      }
    }
  }
}
