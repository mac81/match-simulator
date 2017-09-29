import Simulator from '../classes/Simulator';
import i18next from 'i18next';
import {EVENTS, PASSING_EVENTS, DRIBBLE_EVENTS, SHOT_EVENTS, RESULTS} from '../events/events';

export class Match {
  constructor(homeTeam, awayTeam) {
    this.simulator = new Simulator(homeTeam, awayTeam);

    const homeTeamId = homeTeam.id;
    const awayTeamID = awayTeam.id;

    this.time = {
      minutes: 0,
      seconds: 0,
    };

    this.stats = {
      score: {
        [homeTeamId]: 0,
        [awayTeamID]: 0,
      },
      passing: {
        totalPasses: {
          [homeTeamId]: 0,
          [awayTeamID]: 0,
        },
      },
      shot: {
        totalShots: {
          [homeTeamId]: 0,
          [awayTeamID]: 0,
        },
      },
      dribble: {
        totalDribbles: {
          [homeTeamId]: 0,
          [awayTeamID]: 0,
        },
      },
    };

    Object.values(PASSING_EVENTS).forEach(event => {
      this.stats.passing = {
        ...this.stats.passing,
        [event]: {
          [RESULTS.SUCCESSFUL]: {
            [homeTeamId]: 0,
            [awayTeamID]: 0,
          },
          [RESULTS.FAILED]: {
            [homeTeamId]: 0,
            [awayTeamID]: 0,
          },
          [RESULTS.INTERCEPTED]: {
            [homeTeamId]: 0,
            [awayTeamID]: 0,
          },
        },
      };
    });

    Object.values(DRIBBLE_EVENTS).forEach(event => {
      this.stats.dribble = {
        ...this.stats.dribble,
        [event]: {
          [RESULTS.SUCCESSFUL]: {
            [homeTeamId]: 0,
            [awayTeamID]: 0,
          },
          [RESULTS.TACKLED]: {
            [homeTeamId]: 0,
            [awayTeamID]: 0,
          },
        },
      };
    });

    Object.values(SHOT_EVENTS).forEach(event => {
      this.stats.shot = {
        ...this.stats.shot,
        [event]: {
          [homeTeamId]: 0,
          [awayTeamID]: 0,
        },
      };
    });
  }

  updateTime(event) {
    switch (event.key) {
      case EVENTS.KICKOFF:
      case EVENTS.SHORT_PASS:
      case EVENTS.THROUGH_BALL:
      case EVENTS.DRIBBLE:
        this.time.seconds += 5;

        if (this.time.seconds >= 60) {
          this.time.minutes += 1;
          this.time.seconds = 0;
        }
        break;
      case EVENTS.SHOT_ON_TARGET:
      case EVENTS.SHOT_OFF_TARGET:
        this.time.seconds += 15;

        if (this.time.seconds >= 60) {
          this.time.minutes += 1;
          this.time.seconds = 0;
        }
        break;
      case EVENTS.GOAL_KICK:
        this.time.seconds += 30;

        if (this.time.seconds >= 60) {
          this.time.minutes += 1;
          this.time.seconds = 0;
        }
        break;
      case RESULTS.GOAL:
        this.time.minutes += 1;
        break;
    }
    // if(event.key === GENERAL_EVENTS.SHORT_PASS || event.key === EVENTS.THROUGHBALL) {
    //   this.time.seconds += 5;
    //
    //   if(this.time.seconds >= 60) {
    //     this.time.minutes += 1;
    //     this.time.seconds = 0;
    //   }
    // }
    //
    // if(event.key === EVENTS.SHOT_OFF_TARGET || event.key === EVENTS.SHOT_ON_TARGET) {
    //   this.time.seconds += 15;
    //
    //   if(this.time.seconds >= 60) {
    //     this.time.minutes += 1;
    //     this.time.seconds = 0;
    //   }
    // }
  }

  logStats(event) {
    if (event.logKey === 'passing') {
      this.stats[event.logKey][event.key][event.result][event.teams.attempt.id] += 1;
      this.stats[event.logKey]['totalPasses'][event.teams.attempt.id] += 1;
    }

    if (event.logKey === 'shot') {
      this.stats[event.logKey][event.key][event.teams.attempt.id] += 1;
      this.stats[event.logKey]['totalShots'][event.teams.attempt.id] += 1;
    }

    if (event.logKey === 'dribble') {
      this.stats[event.logKey][event.key][event.result][event.teams.attempt.id] += 1;
      this.stats[event.logKey]['totalDribbles'][event.teams.attempt.id] += 1;
    }

    if (event.result === 'goal') {
      this.stats['score'][event.teams.attempt.id] += 1;
    }
  }

  getStats() {
    return this.stats;
  }

  getTime() {
    return this.time;
  }

  logCommentary(event) {
    return {
      ...event,
      commentary: [
        i18next.t(`${event.key}.${event.from}.attempt`, {
          attackingTeam: event.teams.attempt.name,
          defendingTeam: event.teams.opponent.name,
          from: event.from,
          to: event.to,
        }),
        i18next.t(`${event.key}.${event.from}.${event.result}`, {
          attackingTeam: event.teams.attempt.name,
          defendingTeam: event.teams.opponent.name,
          from: event.from,
          to: event.to,
        }),
      ],
    };
  }

  simulateMatch(isLive = false, onlyKeyEvents = false) {
    const ms = isLive ? 100 : 0;
    let event = {};
    const events = [];

    // const wait = ms => new Promise(r => setTimeout(r, ms));
    // const repeat = (ms, func) => new Promise(r => (
    //   intervalID = setInterval(func, ms),
    //   wait(ms).then(r)
    // ));
    // const myfunction = () => new Promise(r => r(console.log('repeating...')));
    // const stopAfter5Secs = () => new Promise(r => r(setTimeout(() => {
    //   clearInterval(intervalID);
    //     console.log('repeat end')
    //   } , 5000))
    // );

    const matchReport = new Promise((resolve, reject) => {
      const timer = setInterval(() => {
        event = this.simulateEvent(event);
        // console.log('Event', event);
        // console.log('Time:', this.time.minutes + ':' + this.time.seconds);

        if (this.time.minutes > 90) {
          clearInterval(timer);
          if (!isLive) {
            resolve(events);
          }
        } else if (isLive) {
          resolve(event); // Why is this not working?
        } else {
          if (onlyKeyEvents && event.isKeyEvent) {
            events.push(event);
          } else if (!onlyKeyEvents) {
            events.push(event);
          }
        }
      }, ms);
    });

    return matchReport;
  }

  simulateEvent(prevEvent) {
    let event = this.simulator.simulateEvent(prevEvent);

    this.logStats(event);
    this.updateTime(event);
    event = this.logCommentary(event);
    // //console.log(event);
    return {...event, stats: {...this.stats}, time: {...this.time}};
  }
}
