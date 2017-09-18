import i18next from 'i18next';
import weighted from 'weighted';
import colors from 'colors';
import { EVENTS, RESULTS} from '../events/events';

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
    this.teamInPossession = 0;
    this.ballAtZone = 2;
    this.hometeam = home;
    this.awayteam = away;

    this.goalkeeperEvents = new GoalkeeperEvents(home, away);
    this.defenceEvents = new DefenceEvents(home, away);
    this.midfieldEvents = new MidfieldEvents(home, away);
    this.offenceEvents = new OffenceEvents(home, away);
  }

  setTeamInPossession() {
    this.teamInPossession = this.getTeamInPossession() === 0 ? 1 : 0;
  }

  getTeamInPossession() {
    return this.teamInPossession;
  }

  setBallPosition(zone) {
    this.ballAtZone = zone;
  }

  getBallPosition() {
    return this.ballAtZone;
  }

  simulateEvent(prevEvent) {
    const ballPosition = this.getBallPosition();
    const teamInPossession = this.getTeamInPossession();

    switch(ballPosition) {
    case 0:
    case 4:
      return this.eventHandler(this.goalkeeperEvents.simulate(teamInPossession, prevEvent));
      break;
    case 1:
      if(teamInPossession === 0) {
        return this.eventHandler(this.defenceEvents.simulate(teamInPossession, prevEvent));
      } else {
        return this.eventHandler(this.offenceEvents.simulate(teamInPossession, prevEvent));
      }
    case 2:
      return this.eventHandler(this.midfieldEvents.simulate(teamInPossession, prevEvent));
    case 3:
      if(teamInPossession === 0) {
        return this.eventHandler(this.offenceEvents.simulate(teamInPossession, prevEvent));
      } else {
        return this.eventHandler(this.defenceEvents.simulate(teamInPossession, prevEvent));
      }
    }
  }

  eventHandler(event) {
    if(event.to === 'defence' && event.result === RESULTS.SUCCESSFUL) {
      this.setBallPosition(this.getTeamInPossession() === 0 ? 1 : 3);
    }

    if(event.to === 'midfield') {
      this.setBallPosition(2);
    }

    if(event.to === 'offence' && event.result === RESULTS.SUCCESSFUL) {
      this.setBallPosition(this.getTeamInPossession() === 0 ? 3 : 1);
    }

    if(event.result === 'save' || event.result === 'goalkick') {
      this.setBallPosition(this.getTeamInPossession() === 0 ? 4 : 0);
    } else if(event.result === 'goal') {
      this.setBallPosition(2);
    }

    if(event.switchTeams) {
      this.setTeamInPossession();
    }

    return event;
  }

}
