import weighted from 'weighted';
import {random, convertRange} from '../utils/utils';
import {EVENTS, OFFENCE_EVENTS, SPECIAL_EVENTS, RESULTS, ZONES, getRandomEvent} from './events';

export class OffenceEvents {
  constructor(simulator) {
    this.simulator = simulator;
  }

  simulate(prevEvent) {
    this.attemptingTeam = this.simulator.getAttemptTeam();
    this.oppositionTeam = this.simulator.getOppositionTeam();

    // if prevEvent === THROUGH_BALL
    // attempt RUN_AT_GOAL_SHOT
    // outcome GOAL, SAVE, POST, GOAL_KICK, TACKLE

    // if prevEvent === DRIBBLE
    // attempt SHOT
    // outcome BLOCK, DEFLECTION, SAVE, POST, GOAL_KICK

    let event;

    if (prevEvent.key === EVENTS.SHORT_PASS && prevEvent.from === ZONES.MIDFIELD) {
      event = getRandomEvent([OFFENCE_EVENTS.DRIBBLE, OFFENCE_EVENTS.SHORT_PASS]);
    } else if (prevEvent.key === EVENTS.SHORT_PASS && prevEvent.from === ZONES.OFFENCE) {
      event = getRandomEvent([OFFENCE_EVENTS.DRIBBLE, OFFENCE_EVENTS.SHORT_PASS, OFFENCE_EVENTS.SHOT]);
    } else if (prevEvent.key === EVENTS.THROUGH_BALL) {
      event = OFFENCE_EVENTS.SHOT;
    } else if (prevEvent.key === EVENTS.DRIBBLE) {
      event = OFFENCE_EVENTS.SHOT;
    } else {
      //TODO: Set correct events. F.ex this can be caused when opponent gk misses throw
      event = getRandomEvent([OFFENCE_EVENTS.SHORT_PASS, OFFENCE_EVENTS.DRIBBLE]);
    }

    switch (event) {
      case OFFENCE_EVENTS.SHORT_PASS:
        return this.dribble();
      case OFFENCE_EVENTS.DRIBBLE:
        return this.dribble();
      case OFFENCE_EVENTS.SHOT:
        return this.shot();
    }
  }

  shot() {
    //Hitting woodwork: 1.5-3.5%

    const attemptStats = this.attemptingTeam.offence.finishing;
    const defenceStats = this.oppositionTeam.defence.positioning;

    const successProbability = convertRange(attemptStats - defenceStats, [-100, 100], [30, 50]);

    if (successProbability > random(100)) {
      const attacker = this.attemptingTeam.offence.finishing;
      const goalkeeper = this.oppositionTeam.gk.reflexes;

      const successProbability = convertRange(attacker - goalkeeper, [-100, 100], [10, 15]);

      if (successProbability > random(100)) {
        return {
          key: OFFENCE_EVENTS.SHOT_ON_TARGET,
          result: RESULTS.GOAL,
          from: ZONES.OFFENCE,
          to: ZONES.MIDFIELD,
          switchTeams: true,
          logKey: 'shot',
          isKeyEvent: true,
          teams: {
            attempt: this.attemptingTeam,
            opponent: this.oppositionTeam,
          },
        };
      } else {
        return {
          key: OFFENCE_EVENTS.SHOT_ON_TARGET,
          result: RESULTS.SAVE,
          from: ZONES.OFFENCE,
          to: ZONES.GOALKEEPER,
          switchTeams: true,
          logKey: 'shot',
          isKeyEvent: true,
          teams: {
            attempt: this.attemptingTeam,
            opponent: this.oppositionTeam,
          },
        };
      }
    } else {
      // TODO: Calculate woodwork, block, deflection etc
      return {
        key: OFFENCE_EVENTS.SHOT_OFF_TARGET,
        result: RESULTS.GOAL_KICK,
        from: ZONES.OFFENCE,
        to: ZONES.GOALKEEPER,
        switchTeams: true,
        logKey: 'shot',
        isKeyEvent: true,
        teams: {
          attempt: this.attemptingTeam,
          opponent: this.oppositionTeam,
        },
      };
    }
  }

  dribble() {
    const attackStats = this.attemptingTeam.midfield.technique;
    const defenceStats = this.oppositionTeam.midfield.tackling;

    const attackProbability = convertRange(attackStats - defenceStats, [-100, 100], [50, 70]);

    if (attackProbability > random(100)) {
      return {
        key: OFFENCE_EVENTS.DRIBBLE,
        result: RESULTS.SUCCESSFUL,
        from: ZONES.OFFENCE,
        to: ZONES.OFFENCE,
        switchTeams: false,
        logKey: 'dribble',
        teams: {
          attempt: this.attemptingTeam,
          opponent: this.oppositionTeam,
        },
      };
    } else {
      // TODO: Calculate freekick, injuries etc
      return {
        key: OFFENCE_EVENTS.DRIBBLE,
        result: RESULTS.TACKLED,
        from: ZONES.OFFENCE,
        to: ZONES.OFFENCE,
        switchTeams: true,
        logKey: 'dribble',
        teams: {
          attempt: this.attemptingTeam,
          opponent: this.oppositionTeam,
        },
      };
    }
  }
}
