import React, { Component } from 'react';
import {Match} from './classes/Match';

import './App.css';

class App extends Component {

  constructor(...args) {
    super(...args);

    this.state = {
      simulation: null
    }
  }

  simulate = () => {
    const match = new Match();
    const simulation = match.simulate();
    this.setState({
      simulation
    })
  }

  render() {
    if(!this.state.simulation) {
      return <button onClick={this.simulate}>Simulate</button>
    }
    console.log(this.state.simulation)
    return (
      <div className="app">
        <button onClick={this.simulate}>Simulate</button>
        <div className="stats">
          <h2>Passing</h2>
          <ul>
            <li>Attempts: {this.state.simulation.stats.passing.attempts}</li>
            <li>Successful: {this.state.simulation.stats.passing.successful}</li>
            <li>Failed: {this.state.simulation.stats.passing.failed}</li>
            <li>Intercepted: {this.state.simulation.stats.passing.intercepted}</li>
          </ul>
        </div>
        <div className="stats">
          <h2>Shots</h2>
          <ul>
            <li>Attempts: {this.state.simulation.stats.shots.attempts}</li>
            <li>On target: {this.state.simulation.stats.shots['on-target']}</li>
            <li>Off target: {this.state.simulation.stats.shots['off-target']}</li>
          </ul>
        </div>
        {this.state.simulation && (
          <div className="final-result">{`${this.state.simulation.score.home} - ${this.state.simulation.score.away}`}</div>
        )}
        <div>
        {this.state.simulation && this.state.simulation.events.map((event, index) => (
          <ul key={index} className={event.data.result}>
            {event.messages.map((message, index) => (
              <li key={index}>
                {`${event.time}: [${event.data.key}] ${message}`}
              </li>
            ))}
          </ul>
        ))}
        </div>
      </div>
    );
  }
}

export default App;
