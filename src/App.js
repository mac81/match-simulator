import React, { Component } from 'react';
import {Match} from './classes/Match';

import './App.css';

class App extends Component {

  constructor(...args) {
    super(...args);

    this.state = {
      homeTeam: {
        id: 1,
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
      },
      awayTeam: {
        id: 2,
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
      },
      currentEvent: null,
      events: []
    };

    this.match = new Match(this.state.homeTeam, this.state.awayTeam);
  }

  simulateMatch = () => {
    const report = this.match.simulateMatch();
    this.setState({
      events: report
    })
  };

  simulateEvent = () => {
    const currentEvent = this.match.simulateEvent(this.state.currentEvent);
    this.setState({
      currentEvent,
      events: [...this.state.events, currentEvent]
    })
  };

  render() {

    const {events, currentEvent, homeTeam, awayTeam} = this.state;
    const stats = this.match.getStats();

    return (
      <div className="app">
        <button onClick={this.simulateMatch} style={{position: 'fixed', top: 0, left: 100}}>Simulate Match</button>
        <button onClick={this.simulateEvent} style={{position: 'fixed', top: 0}}>Simulate Event</button>

        {currentEvent && (
          <div>
            {`${currentEvent.time.minutes}:${currentEvent.time.seconds}`}
          </div>
        )}

        {stats && (
          <div>
            <ul>
              <li>{`${stats[homeTeam.id].goal} score ${stats[awayTeam.id].goal}`}</li>
            </ul>
            <ul>
              <li>{`${stats[homeTeam.id].shots.attempts} attempted shots ${stats[awayTeam.id].shots.attempts}`}</li>
              <li>{`${stats[homeTeam.id].shots['on-target']} shots on-target ${stats[awayTeam.id].shots['on-target']}`}</li>
              <li>{`${stats[homeTeam.id].shots['off-target']} shots off-target ${stats[awayTeam.id].shots['off-target']}`}</li>
            </ul>
            <ul>
              <li>{`${stats[homeTeam.id].throughball.attempts} attempted throughballs ${stats[awayTeam.id].throughball.attempts}`}</li>
              <li>{`${stats[homeTeam.id].throughball.successful} successful throughballs ${stats[awayTeam.id].throughball.successful}`}</li>
              <li>{`${stats[homeTeam.id].throughball.failed} failed throughballs ${stats[awayTeam.id].throughball.failed}`}</li>
              <li>{`${stats[homeTeam.id].throughball.intercepted} intercepted throughballs ${stats[awayTeam.id].throughball.intercepted}`}</li>
            </ul>
            <ul>
              <li>{`${stats[homeTeam.id].shortpass.attempts} attempted passes ${stats[awayTeam.id].shortpass.attempts}`}</li>
              <li>{`${stats[homeTeam.id].shortpass.successful} successful passes ${stats[awayTeam.id].shortpass.successful}`}</li>
              <li>{`${stats[homeTeam.id].shortpass.failed} failed passes ${stats[awayTeam.id].shortpass.failed}`}</li>
              <li>{`${stats[homeTeam.id].shortpass.intercepted} intercepted passes ${stats[awayTeam.id].shortpass.intercepted}`}</li>
            </ul>
          </div>
        )}

        <table>
          <thead>
          <tr>
            <th>From</th>
            <th>To</th>
            <th>Key</th>
            <th>Result</th>
            <th>SwitchTeams</th>
            <th>Commentary</th>
          </tr>
          </thead>
          <tbody>
          {events.map((event, index) => (
            <tr key={index} style={event.teams.attempt.name === 'United' ? {backgroundColor: 'red'} : {backgroundColor: 'lightblue'}}>
              <td>{event.from}</td>
              <td>{event.to}</td>
              <td>{event.key}</td>
              <td>{event.result}</td>
              <td>{event.switchTeams ? 'true' : 'false'}</td>
              <td>
                <ul>
                  {event.commentary.map((comment, index) => (
                    <li key={index}>{comment}</li>
                  ))}
                </ul>
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
