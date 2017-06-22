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

    console.log(this.state.simulation)
    return (
      <div className="app">
        <button onClick={this.simulate}>Simulate</button>
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
