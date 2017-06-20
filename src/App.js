import React, { Component } from 'react';
import {Match} from './classes/Match';

import './App.css';

class App extends Component {

  constructor(...args) {
    super(...args);

    this.match = new Match();
    this.state = {
      simulation: null
    }
  }

  simulate = () => {
    const simulation = this.match.simulate();
    this.setState({
      simulation
    })
  }

  render() {


    return (
      <div className="app">
        <button onClick={this.simulate}>Simulate</button>
        <ul>
        {this.state.simulation && this.state.simulation.events.map((event, index) => (
          <li key={index}>{event.attempt || event} {event.result}</li>
        ))}
        </ul>
      </div>
    );
  }
}

export default App;
