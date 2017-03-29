import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import config from './config';
import utils from './fetch-utils';
import 'whatwg-fetch';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: []
		}
	}

	loadData() {
		fetch(config.apiUrl + '/test')
			.then(utils.checkStatus)
			.then(utils.parseJSON)
			.then(data => {
				this.setState({ data });
				console.log(data);
			})
			.catch(err => console.log(err));
	}

	componentDidMount() {
		this.loadData();
	}
	
	render() {
		return (
			<div className="App">
				<div className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<h2>Welcome to React</h2>
				</div>
				<ul>
					{this.state.data.map(data =>
						<li key={data.NAME}>{data.NAME}</li>
					)}
				</ul>
			</div>
		);
	}
}

export default App;
