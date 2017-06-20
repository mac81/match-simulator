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

  constructor(home, away) {
    this.teamInPossesion = 0;
    this.ballAtZone = 2;
    this.hometeam = home;
    this.awayteam = away;

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

  simulateMatch() {
    let event = null;
    let homescore = 0;
    let awayscore = 0;

    const eventMessages = {
      events: [],
      score: `${homescore} - ${awayscore}`,
      stats: {
        home: {
          onTarget: 0,
          offTarget: 0
        },
        away: {}
      }
    };

    for(let min = 0; min <= 90; min++ ) {

      if(!event) {
        eventMessages.events.push(i18next.t('kickoff', {
          team: this.hometeam.name
        }))
      }

      event = this.simulateEvent(event);

      eventMessages.events.push({
        time: `#### ${min} ####`,
        attempt: i18next.t(`${event.attempt.type}.${event.attempt.from}.attempt`, {
          attackingTeam: event.teams.attempt.name,
          defendingTeam: event.teams.opponent.name,
          from: event.attempt.from,
          to: event.attempt.to
        }),
        result: i18next.t(`${event.attempt.type}.${event.attempt.from}.${event.result.type}`, {
          attackingTeam: event.teams.attempt.name,
          defendingTeam: event.teams.opponent.name,
          from: event.attempt.from,
          to: event.attempt.to
        })
      });

      // Best teams should average around 7 per game, worst teams around 2.5
      if(event.attempt.type === 'on-target-shot') {
        eventMessages.stats.home.onTarget += 1;
      }

      // Best teams should average around 18 per game, worst teams around 9
      if(event.attempt.type === 'off-target-shot') {
        eventMessages.stats.home.offTarget += 1;
      }

      if(event.result.type === 'goal') {
        this.getTeamInPossesion() === 0 ? homescore++ : awayscore++;
        eventMessages.score = `${homescore} - ${awayscore}`;
        eventMessages.events.push(i18next.t('kickoff', {
          team: event.teams.opponent.name
        }))
      }

      event = this.eventHandler(event);
    }

    return eventMessages;
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
    if(event.attempt.to === 'defence' && event.result.type === 'success') {
      this.setBallPosition(this.getTeamInPossesion() === 0 ? 1 : 3);
    }

    if(event.attempt.to === 'midfield') {
      this.setBallPosition(2);
    }

    if(event.attempt.to === 'offence') {
      this.setBallPosition(this.getTeamInPossesion() === 0 ? 3 : 1);
    }

    if(event.result.type === 'save' || event.result.type === 'goalkick') {
      this.setBallPosition(this.getTeamInPossesion() === 0 ? 4 : 0);
    } else if(event.result.type === 'goal') {
      this.setBallPosition(2);
    }

    if(event.result.switchTeams) {
      this.setTeamInPossesion();
    }

    return event;
  }

}
