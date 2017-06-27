import Simulator from '../classes/Simulator';

var home = {
  name: 'United',
  gk: 50,
  defence: {
    passing: 50,
    technique: 50,
    finishing: 50,
    positioning: 50,
    tackling: 50
  },
  midfield: {
    passing: 50,
    technique: 50,
    finishing: 50,
    positioning: 50,
    tackling: 50
  },
  offence: {
    passing: 50,
    technique: 50,
    finishing: 50,
    positioning: 50,
    tackling: 50
  },
  formation: [4,4,2]
};

var away = {
  name: 'City',
  gk: 50,
  defence: {
    passing: 50,
    technique: 50,
    finishing: 50,
    positioning: 50,
    tackling: 50
  },
  midfield: {
    passing: 50,
    technique: 50,
    finishing: 50,
    positioning: 50,
    tackling: 50
  },
  offence: {
    passing: 50,
    technique: 50,
    finishing: 50,
    positioning: 50,
    tackling: 50
  },
  formation: [4,4,2]
};

const TEAMS = {
  0: home,
  1: away
};

export class Match {

  constructor() {
    this.simulator = new Simulator(home, away, false);
  }

  simulate() {
    const matchReport = this.simulator.simulateMatch();

    return matchReport;
  }



}
