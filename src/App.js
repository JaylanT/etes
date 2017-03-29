import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import config from './config';
import 'whatwg-fetch';

class App extends Component {
  render() {
	  fetch(config.apiUrl + '/test')
	  .then(res => {
		  if (res.status !== 200) {  
			throw Error(res.status + ' (' + res.statusText + ')');
		  }
		  return res.json();
	  })
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
