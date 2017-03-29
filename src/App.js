import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import config from './config';
import utils from './fetch-utils';
import 'whatwg-fetch';

class App extends Component {
  render() {
	  fetch(config.apiUrl + '/test')
	  .then(utils.checkStatus)
	  .then(utils.parseJSON)
	  .then(data => {
		  console.log(data);
	  })
	  .catch(err => console.log(err));

    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          Test
        </p>
      </div>
    );
  }
}

export default App;
