import React, {Component} from 'react';
import {Match} from './classes/Match';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import './App.css';

class App extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      homeTeam: {
        id: 1,
        name: 'United',
        gk: {
          passing: 100,
          throwing: 100,
          arial: 100,
          reflexes: 100,
          oneOnOne: 100,
        },
        defence: {
          passing: 100,
          technique: 100,
          finishing: 100,
          positioning: 100,
          tackling: 100,
        },
        midfield: {
          passing: 100,
          technique: 100,
          finishing: 100,
          positioning: 100,
          heading: 100,
          tackling: 100,
        },
        offence: {
          passing: 100,
          technique: 100,
          finishing: 100,
          positioning: 100,
          tackling: 100,
        },
        formation: [4, 4, 2],
      },
      awayTeam: {
        id: 2,
        name: 'City',
        gk: {
          passing: 0,
          throwing: 0,
          arial: 0,
          reflexes: 0,
          oneOnOne: 0,
        },
        defence: {
          passing: 0,
          technique: 0,
          finishing: 0,
          positioning: 0,
          tackling: 0,
        },
        midfield: {
          passing: 0,
          technique: 0,
          finishing: 0,
          positioning: 0,
          tackling: 0,
          heading: 0,
        },
        offence: {
          passing: 0,
          technique: 0,
          finishing: 0,
          positioning: 0,
          tackling: 0,
        },
        formation: [4, 4, 2],
      },
      currentEvent: null,
      events: [],
    };
  }

  onStatChange = (value, team, zone, stat) => {
    this.setState({
      [team]: {
        ...this.state[team],
        [zone]: {
          ...this.state[team][zone],
          [stat]: value,
        },
      },
    });
    this.match = new Match(this.state.homeTeam, this.state.awayTeam);
  };

  simulateMatch = () => {
    this.match = new Match(this.state.homeTeam, this.state.awayTeam);

    // Generate full match
    this.match.simulateMatch(false).then(events => {
      this.setState({
        events: events,
      });
    });
  };

  simulateLiveMatch = () => {
    this.match = new Match(this.state.homeTeam, this.state.awayTeam);

    // Generate live match
    this.match.simulateMatch(true).then(event => {
      console.log(event);
    });
  };

  simulateEvent = () => {
    const currentEvent = this.match.simulateEvent(this.state.currentEvent);
    this.setState({
      currentEvent,
      events: [...this.state.events, currentEvent],
    });
  };

  render() {
    const {events, currentEvent, homeTeam, awayTeam} = this.state;
    const stats = this.match && this.match.getStats();
    const time = this.match && this.match.getTime();

    console.log(stats);
    console.log('events: ', events);

    const homeTotalPasses = stats && stats['passing']['totalPasses'][homeTeam.id];
    const homeSuccessfulPasses =
      stats &&
      stats['passing']['short-pass']['successful'][homeTeam.id] +
        stats['passing']['long-pass']['successful'][homeTeam.id] +
        stats['passing']['through-ball']['successful'][homeTeam.id];
    const homePassPercentage = Math.round(homeSuccessfulPasses / homeTotalPasses * 100) || 0;

    const awayTotalPasses = stats && stats['passing']['totalPasses'][awayTeam.id];
    const awaySuccessfulPasses =
      stats &&
      stats['passing']['short-pass']['successful'][awayTeam.id] +
        stats['passing']['long-pass']['successful'][awayTeam.id] +
        stats['passing']['through-ball']['successful'][awayTeam.id];
    const awayPassPercentage = Math.round(awaySuccessfulPasses / awayTotalPasses * 100) || 0;

    const homeTotalDribbles = stats && stats['dribble']['totalDribbles'][homeTeam.id];
    const homeSuccessfulDribbles = stats && stats['dribble']['dribble']['successful'][homeTeam.id];
    const homeDribblePercentage = Math.round(homeSuccessfulDribbles / homeTotalDribbles * 100) || 0;

    const awayTotalDribbles = stats && stats['dribble']['totalDribbles'][awayTeam.id];
    const awaySuccessfulDribbles = stats && stats['dribble']['dribble']['successful'][awayTeam.id];
    const awayDribblePercentage = Math.round(awaySuccessfulDribbles / awayTotalDribbles * 100) || 0;

    const homeTotalShots = stats && stats['shot']['totalShots'][homeTeam.id];
    const homeShotsOnTarget = stats && stats['shot']['shot-on-target'][homeTeam.id];

    const awayTotalShots = stats && stats['shot']['totalShots'][awayTeam.id];
    const awayShotsOnTarget = stats && stats['shot']['shot-on-target'][awayTeam.id];

    return (
      <div className="app">
        <button onClick={this.simulateMatch} style={{position: 'fixed', top: 0, left: 230}}>
          Simulate Match
        </button>
        <button onClick={this.simulateLiveMatch} style={{position: 'fixed', top: 0, left: 100}}>
          Simulate Live Match
        </button>
        <button onClick={this.simulateEvent} style={{position: 'fixed', top: 0}}>
          Simulate Event
        </button>

        <div>
          <Slider onChange={value => this.onStatChange(value, 'homeTeam', 'defence', 'passing')} />
        </div>

        {stats && (
          <div>
            <h2>Match Stats</h2>
            <table>
              <thead>
                <tr>
                  <th>Manchester United</th>
                  <th />
                  <th>Manchester City</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{stats['score'][homeTeam.id]}</td>
                  <td>Score</td>
                  <td>{stats['score'][awayTeam.id]}</td>
                </tr>
                <tr>
                  <td>{stats['possession'][homeTeam.id]}</td>
                  <td>Possession</td>
                  <td>{stats['possession'][awayTeam.id]}</td>
                </tr>
                <tr>
                  <td>{homeTotalShots}</td>
                  <td>Shots</td>
                  <td>{awayTotalShots}</td>
                </tr>
                <tr>
                  <td>{homeShotsOnTarget}</td>
                  <td>Shots on target</td>
                  <td>{awayShotsOnTarget}</td>
                </tr>
                <tr>
                  <td>{homeTotalPasses}</td>
                  <td>Passes</td>
                  <td>{awayTotalPasses}</td>
                </tr>
                <tr>
                  <td>{homePassPercentage}</td>
                  <td>Pass Percentage</td>
                  <td>{awayPassPercentage}</td>
                </tr>
                <tr>
                  <td>{homeTotalDribbles}</td>
                  <td>Total Dribbles</td>
                  <td>{awayTotalDribbles}</td>
                </tr>
                <tr>
                  <td>{homeDribblePercentage}</td>
                  <td>Dribble Percentage</td>
                  <td>{awayDribblePercentage}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>From</th>
              <th>To</th>
              <th>Key</th>
              <th>Result</th>
              <th>SwitchTeams</th>
              <th>Commentary</th>
            </tr>
          </thead>
          <tbody>
            {events &&
              events.map((event, index) => (
                <tr
                  key={index}
                  style={
                    event.teams.attempt.name === 'United' ? {backgroundColor: 'red'} : {backgroundColor: 'lightblue'}
                  }>
                  <td>{`${event.time.minutes}:${event.time.seconds}`}</td>
                  <td>{event.from}</td>
                  <td>{event.to}</td>
                  <td>{event.key}</td>
                  <td>{event.result}</td>
                  <td>{event.switchTeams ? 'true' : 'false'}</td>
                  <td>
                    <ul>{event.commentary.map((comment, index) => <li key={index}>{comment}</li>)}</ul>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {/*<button onClick={this.simulate}>Simulate</button>*/}
        {/*<div className="stats">*/}
        {/*<h2>Passing</h2>*/}
        {/*<ul>*/}
        {/*<li>Attempts: {this.state.simulation.stats.passing.attempts}</li>*/}
        {/*<li>Successful: {this.state.simulation.stats.passing.successful}</li>*/}
        {/*<li>Failed: {this.state.simulation.stats.passing.failed}</li>*/}
        {/*<li>Intercepted: {this.state.simulation.stats.passing.intercepted}</li>*/}
        {/*</ul>*/}
        {/*</div>*/}
        {/*<div className="stats">*/}
        {/*<h2>Shots</h2>*/}
        {/*<ul>*/}
        {/*<li>Attempts: {this.state.simulation.stats.shots.attempts}</li>*/}
        {/*<li>On target: {this.state.simulation.stats.shots['on-target']}</li>*/}
        {/*<li>Off target: {this.state.simulation.stats.shots['off-target']}</li>*/}
        {/*</ul>*/}
        {/*</div>*/}
        {/*{this.state.simulation && (*/}
        {/*<div className="final-result">{`${this.state.simulation.score.home} - ${this.state.simulation.score.away}`}</div>*/}
        {/*)}*/}
        {/*<div>*/}
        {/*{this.state.simulation && this.state.simulation.events.map((event, index) => (*/}
        {/*<ul key={index} className={event.data.result}>*/}
        {/*{event.messages.map((message, index) => (*/}
        {/*<li key={index}>*/}
        {/*{`${event.time}: [${event.data.key}] ${message}`}*/}
        {/*</li>*/}
        {/*))}*/}
        {/*</ul>*/}
        {/*))}*/}
        {/*</div>*/}
      </div>
    );
  }
}

export default App;
