import {RESULTS, ZONES} from '../events/events';

import {GoalkeeperEvents} from '../events/Goalkeeper';
import {DefenceEvents} from '../events/Defence';
import {MidfieldEvents} from '../events/Midfield';
import {OffenceEvents} from '../events/Offence';

/* Zones
 | GK | DEF | MID | OFF | GK |
 | 0  |  1  |  2  |  3  | 4  |
 */

export default class Simulator {
  constructor(home, away) {
    this.teamInPossession = 0;
    this.ballAtZone = 2;
    this.hometeam = home;
    this.awayteam = away;

    this.goalkeeperEvents = new GoalkeeperEvents(this);
    this.defenceEvents = new DefenceEvents(this);
    this.midfieldEvents = new MidfieldEvents(this);
    this.offenceEvents = new OffenceEvents(this);
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

  getAttemptTeam() {
    return this.teamInPossession === 0 ? this.hometeam : this.awayteam;
  }

  getOppositionTeam() {
    return this.teamInPossession === 0 ? this.awayteam : this.hometeam;
  }

  simulateEvent(prevEvent) {
    const ballPosition = this.getBallPosition();
    const teamInPossession = this.getTeamInPossession();

    switch (ballPosition) {
      case 0:
      case 4:
        return this.eventHandler(this.goalkeeperEvents.simulate(prevEvent));
        break;
      case 1:
        if (teamInPossession === 0) {
          return this.eventHandler(this.defenceEvents.simulate(prevEvent));
        } else {
          return this.eventHandler(this.offenceEvents.simulate(prevEvent));
        }
      case 2:
        return this.eventHandler(this.midfieldEvents.simulate(prevEvent));
      case 3:
        if (teamInPossession === 0) {
          return this.eventHandler(this.offenceEvents.simulate(prevEvent));
        } else {
          return this.eventHandler(this.defenceEvents.simulate(prevEvent));
        }
    }
  }

  eventHandler(event) {
    if (event.to === ZONES.DEFENCE) {
      this.setBallPosition(this.getTeamInPossession() === 0 ? 1 : 3);
    }

    if (event.to === ZONES.MIDFIELD) {
      this.setBallPosition(2);
    }

    if (event.to === ZONES.OFFENCE) {
      this.setBallPosition(this.getTeamInPossession() === 0 ? 3 : 1);
    }

    if (event.result === RESULTS.SAVE || event.result === RESULTS.GOAL_KICK) {
      this.setBallPosition(this.getTeamInPossession() === 0 ? 4 : 0);
    } else if (event.result === RESULTS.GOAL) {
      this.setBallPosition(2);
    }

    if (event.switchTeams) {
      this.setTeamInPossession();
    }

    return event;
  }
}
