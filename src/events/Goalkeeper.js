const GOALKEEPER_EVENTS = {
  0: 'short-throw',
  1: 'longKick',
  2: 'goalkick'
};

export class GoalkeeperEvents {

  constructor(home, away) {
    this.hometeam = home;
    this.awayteam = away;
  }

  simulate(teamInPossesion, prevEvent) {
    this.teamInPossesion = teamInPossesion;

    const eventId = Math.floor(Math.random() * 4) + 1;
    const eventType = prevEvent && prevEvent.result === 'goalkick' ? GOALKEEPER_EVENTS[2] : GOALKEEPER_EVENTS[0];

    switch(eventType) {
    case 'short-throw':
      return this.shortThrow();
    case 'goalkick':
      return this.goalkick();
    }
  }

  shortThrow() {
    return {
      key: 'short-throw',
      result: 'success',
      from: 'goalkeeper',
      to: 'defence',
      switchTeams: false,
      teams: {
        attempt: this.teamInPossesion === 0 ? this.hometeam : this.awayteam,
        opponent: this.teamInPossesion === 0 ? this.awayteam : this.hometeam
      }
    }
  }

  goalkick() {
    return {
      key: 'goalkick',
      result: 'success',
      from: 'goalkeeper',
      to: 'defence',
      switchTeams: false,
      teams: {
        attempt: this.teamInPossesion === 0 ? this.hometeam : this.awayteam,
        opponent: this.teamInPossesion === 0 ? this.awayteam : this.hometeam
      }
    }
  }
}
