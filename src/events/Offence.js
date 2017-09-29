import weighted from 'weighted';
import { random } from '../utils/utils';
import { EVENTS, OFFENCE_EVENTS, SPECIAL_EVENTS, RESULTS, ZONES, getRandomEvent } from './events';

export class OffenceEvents {
  constructor(simulator) {
    this.simulator = simulator;
  }

  simulate(prevEvent) {
    this.attemptingTeam = this.simulator.getAttemptTeam();
    this.oppositionTeam = this.simulator.getOppositionTeam();

    // if prevEvent === SHORT_PASS from midfield
    // attempt DRIBBLE, SHORT_PASS

    // if prevEvent === SHORT_PASS from offence
    // attempt DRIBBLE, SHORT_PASS, SHOT

    // if prevEvent === THROUGH_BALL
    // attempt RUN_AT_GOAL_SHOT
    // outcome GOAL, SAVE, POST, GOAL_KICK, TACKLE

    // if prevEvent === DRIBBLE
    // attempt SHOT
    // outcome BLOCK, DEFLECTION, SAVE, POST, GOAL_KICK

    let event;

    if (prevEvent.key === EVENTS.SHORT_PASS && prevEvent.from === ZONES.MIDFIELD) {
      const possibleEvents = [OFFENCE_EVENTS.DRIBBLE, OFFENCE_EVENTS.SHORT_PASS];
      event = getRandomEvent(possibleEvents);
    } else if (prevEvent.key === EVENTS.SHORT_PASS && prevEvent.from === ZONES.OFFENCE) {
      const possibleEvents = [OFFENCE_EVENTS.DRIBBLE, OFFENCE_EVENTS.SHORT_PASS, OFFENCE_EVENTS.SHOT];
      event = getRandomEvent(possibleEvents);
    } else if (prevEvent.key === EVENTS.THROUGH_BALL) {
      event = OFFENCE_EVENTS.SHOT;
    } else if (prevEvent.key === EVENTS.DRIBBLE) {
      event = OFFENCE_EVENTS.SHOT;
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
    const onTarget = this.attemptingTeam.offence.finishing - random(20);
    const offTarget = 100 - onTarget;

    const shotOptions = {
      'on-target': onTarget / 100,
      'off-target': offTarget / 100,
    };

    const shotOutcome = weighted.select(shotOptions);

    let resultOutcome;

    if (shotOutcome === 'on-target') {
      const attacker = this.attemptingTeam.offence.finishing - random(20);
      const goalkeeper = this.oppositionTeam.gk - random(20);

      //TODO: Calculate chance of deflection, hitting post etc.

      resultOutcome = attacker > goalkeeper ? RESULTS.GOAL : RESULTS.SAVE;
    } else {
      resultOutcome = RESULTS.GOAL_KICK;
    }

    return {
      key: `shot-${shotOutcome}`,
      result: resultOutcome,
      from: ZONES.OFFENCE,
      to: ZONES.OFFENCE,
      switchTeams: true,
      logKey: 'shot',
      isKeyEvent: true,
      teams: {
        attempt: this.attemptingTeam,
        opponent: this.oppositionTeam,
      },
    };
  }

  dribble() {
    const attackProbability = this.attemptingTeam.offence.technique - random(20);
    const defenceProbability = this.oppositionTeam.defence.tackling - random(20);

    if (attackProbability > defenceProbability) {
      return {
        key: OFFENCE_EVENTS.DRIBBLE,
        result: RESULTS.SUCCESSFUL,
        from: ZONES.OFFENCE,
        to: ZONES.OFFENCE,
        switchTeams: false,
        teams: {
          attempt: this.attemptingTeam,
          opponent: this.oppositionTeam,
        },
      };
    } else {
      return {
        key: OFFENCE_EVENTS.DRIBBLE,
        result: RESULTS.TACKLED,
        from: ZONES.OFFENCE,
        to: ZONES.OFFENCE,
        switchTeams: true,
        teams: {
          attempt: this.attemptingTeam,
          opponent: this.oppositionTeam,
        },
      };
    }
  }
}
