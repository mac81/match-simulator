import Simulator from '../classes/Simulator';
import i18next from 'i18next';
import { EVENTS, RESULTS} from '../events/events';

export class Match {

  constructor(homeTeam, awayTeam) {
    this.simulator = new Simulator(homeTeam, awayTeam);

    this.homeTeam = homeTeam.id;
    this.awayTeam = awayTeam.id;

    this.time = {
      minutes: 0,
      seconds: 0
    };

    this.stats = {
      [this.homeTeam] : {
        shortpass: {
          attempts: 0,
          successful: 0,
          failed: 0,
          intercepted: 0
        },
        throughball: {
          attempts: 0,
          successful: 0,
          failed: 0,
          intercepted: 0
        },
        shots: {
          attempts: 0,
          'on-target': 0,
          'off-target': 0
        },
        goal: 0
      },
      [this.awayTeam] : {
        shortpass: {
          attempts: 0,
          successful: 0,
          failed: 0,
          intercepted: 0
        },
        throughball: {
          attempts: 0,
          successful: 0,
          failed: 0,
          intercepted: 0
        },
        shots: {
          attempts: 0,
          'on-target': 0,
          'off-target': 0
        },
        goal: 0
      }
    };
  }

  updateTime(event) {
    if(event.key === EVENTS.SHORTPASS || event.key === EVENTS.THROUGHBALL) {
      this.time.seconds += 5;

      if(this.time.seconds >= 60) {
        this.time.minutes += 1;
        this.time.seconds = 0;
      }
    }

    if(event.key === EVENTS.SHOT_OFF_TARGET || event.key === EVENTS.SHOT_ON_TARGET) {
      this.time.seconds += 15;

      if(this.time.seconds >= 60) {
        this.time.minutes += 1;
        this.time.seconds = 0;
      }
    }
  }

  logStats(event) {

    if(event.key === 'kickoff') {
      return;
    }

    if(event.result === RESULTS.INTERCEPTED && this.stats[event.teams.opponent.id][event.key] ) {
      this.stats[event.teams.opponent.id][event.key][event.result] += 1;
    } else if(event.result === RESULTS.GOAL){
      this.stats[event.teams.attempt.id][event.result] += 1;
    } else if(this.stats[event.teams.attempt.id][event.key]){
      this.stats[event.teams.attempt.id][event.key][event.result] += 1;
    }
  }

  getStats() {
    return this.stats;
  }

  logCommentary(event) {
    return {
      ...event,
      commentary: [
        i18next.t(`${event.key}.${event.from}.attempt`, {
          attackingTeam: event.teams.attempt.name,
          defendingTeam: event.teams.opponent.name,
          from: event.from,
          to: event.to
        }),
        i18next.t(`${event.key}.${event.from}.${event.result}`, {
          attackingTeam: event.teams.attempt.name,
          defendingTeam: event.teams.opponent.name,
          from: event.from,
          to: event.to
        })
      ]
    }

  }

  simulateMatch() {
    const matchReport = [];
    let event = null;
    for(var i = 0; i < 90; i++) {
      event = this.simulator.simulateEvent(event)
      this.logStats(event);
      this.updateTime(event);
      event = this.logCommentary(event);
      matchReport.push({...event, stats: {...this.stats}, time: {...this.time}});
    }
    //const matchReport = this.simulator.simulateMatch();

    return matchReport;
  }

  simulateEvent(prevEvent) {
    let event = this.simulator.simulateEvent(prevEvent);

    this.logStats(event);
    this.updateTime(event);
    event = this.logCommentary(event);

    return {...event, stats: {...this.stats}, time: {...this.time}};
  }



}
