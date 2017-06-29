import i18next from 'i18next';
import weighted from 'weighted';
import colors from 'colors';

import {GoalkeeperEvents} from '../events/Goalkeeper';
import {DefenceEvents} from '../events/Defence';
import {MidfieldEvents} from '../events/Midfield';
import {OffenceEvents} from '../events/Offence';

/* Zones
 | GK | DEF | MID | OFF | GK |
 | 0  |  1  |  2  |  3  | 4  |
 */

/* Pass
 {
 teams: {
 attempt: attackingTeam,
 opponent: defendingTeam
 },
 attempt: {
 type: 'shortpass',
 from: 'defence/midfield/offence',
 to: 'defence/midfield/offence'
 },
 result: {
 type: 'success/failure/intercepted',  //failure.. really bad = throw in/corner, semi bad = intercepted or teammate rescues
 switchTeams: true/false
 }
 }
 */

/* Shot
 {
 teams: {
 attempt: attackingTeam,
 opponent: defendingTeam
 },
 attempt: {
 type: 'shot',
 from: 'offence',
 to: 'offence', (Needed?)
 },
 result: {
 type: 'goal/save/goalkick',
 switchTeams: true/false
 }
 }
 */

export default class Simulator {

  constructor(home, away, onlyKeyEvents = false) {
    this.onlyKeyEvents = onlyKeyEvents;
    this.teamInPossesion = 0;
    this.ballAtZone = 2;
    this.hometeam = home;
    this.awayteam = away;
    this.homeScore = 0;
    this.awayScore = 0;

    this.goalkeeperEvents = new GoalkeeperEvents(home, away);
    this.defenceEvents = new DefenceEvents(home, away);
    this.midfieldEvents = new MidfieldEvents(home, away);
    this.offenceEvents = new OffenceEvents(home, away);
  }

  setTeamInPossesion() {
    const newTeamInPossesion = this.getTeamInPossesion() === 0 ? 1 : 0;
    this.teamInPossesion = newTeamInPossesion;
  }

  getTeamInPossesion() {
    return this.teamInPossesion;
  }

  setBallPosition(zone) {
    this.ballAtZone = zone;
  }

  getBallPosition() {
    return this.ballAtZone;
  }

  isKeyEvent(event) {
    if(event.result === 'goal' || event.key === 'shot-on-target' || event.key === 'shot-off-target') {
      return true;
    }
  }

  logStats(event) {
    if(event.key === 'shortpass') {
      this.eventMessages.stats.passing.attempts += 1;
    }
    if(event.key === 'shortpass' && event.result === 'success') {
      this.eventMessages.stats.passing.successful += 1;
    }
    if(event.key === 'shortpass' && event.result === 'fail') {
      this.eventMessages.stats.passing.failed += 1;
    }
    if(event.key === 'shortpass' && event.result === 'intercept') {
      this.eventMessages.stats.passing.intercepted += 1;
    }

    if(event.key.includes('shot')) {
      this.eventMessages.stats.shots.attempts += 1;
    }
    if(event.key === 'shot-on-target') {
      this.eventMessages.stats.shots['on-target'] += 1;
    }
    if(event.key === 'shot-off-target') {
      this.eventMessages.stats.shots['off-target'] += 1;
    }
  }

  logEvent(min, event) {
    if(this.onlyKeyEvents) {
      if(this.isKeyEvent(event)) {
        this.eventMessages.events.push({
          time: min,
          data: event,
          messages: [
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
        });
      }
    } else {
      this.eventMessages.events.push({
        time: min,
        data: event,
        messages: [
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
      });
    }
  }

  simulateMatch() {
    let event = {
      key: 'kickoff'
    };

    this.eventMessages = {
      events: [],
      stats: {
        passing: {
          attempts: 0,
          successful: 0,
          failed: 0,
          intercepted: 0
        },
        shots: {
          attempts: 0,
          'on-target': 0,
          'off-target': 0
        }
      }
    };

    for(let min = 0; min <= 90; min++ ) {
      event = this.simulateEvent(event);
      this.logEvent(min, event);
      this.logStats(event);
      event = this.eventHandler(event);

      event = this.simulateEvent(event);
      this.logEvent(min, event);
      this.logStats(event);
      event = this.eventHandler(event);

      event = this.simulateEvent(event);
      this.logEvent(min, event);
      this.logStats(event);
      event = this.eventHandler(event);
    }

    this.eventMessages.score = {
      home: this.homeScore,
      away: this.awayScore
    };
    this.eventMessages.log = this.stats;

    // const test = this.eventMessages.events.filter(el => {
    //   return el.data.key === 'tackle';
    // });
    //
    // console.log(test);


    return this.eventMessages;
  }

  simulateEvent(prevEvent) {
    const ballPosition = this.getBallPosition();
    const teamInPossesion = this.getTeamInPossesion();

    switch(ballPosition) {
    case 0:
    case 4:
      return this.goalkeeperEvents.simulate(teamInPossesion, prevEvent);
      break;
    case 1:
      if(teamInPossesion === 0) {
        return this.defenceEvents.simulate(teamInPossesion, prevEvent);
      } else {
        return this.offenceEvents.simulate(teamInPossesion, prevEvent);
      }
    case 2:
      return this.midfieldEvents.simulate(teamInPossesion, prevEvent);
    case 3:
      if(teamInPossesion === 0) {
        return this.offenceEvents.simulate(teamInPossesion, prevEvent);
      } else {
        return this.defenceEvents.simulate(teamInPossesion, prevEvent);
      }
    }
  }

  eventHandler(event) {
    if(event.to === 'defence' && event.result === 'success') {
      this.setBallPosition(this.getTeamInPossesion() === 0 ? 1 : 3);
    }

    if(event.to === 'midfield') {
      this.setBallPosition(2);
    }

    if(event.to === 'offence' && event.result === 'success') {
      this.setBallPosition(this.getTeamInPossesion() === 0 ? 3 : 1);
    }

    if(event.result === 'save' || event.result === 'goalkick') {
      this.setBallPosition(this.getTeamInPossesion() === 0 ? 4 : 0);
    } else if(event.result === 'goal') {
      this.setBallPosition(2);
    }

    if(event.result === 'goal') {
      this.getTeamInPossesion() === 0 ? this.homeScore++ : this.awayScore++;
    }

    if(event.switchTeams) {
      this.setTeamInPossesion();
    }

    return event;
  }

}
