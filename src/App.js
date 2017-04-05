import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import config from './config';
import utils from './utils/fetch-utils';
import 'whatwg-fetch';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: []
		}
	}

	loadData() {
		fetch(config.apiUrl + '/tickets')
			.then(utils.checkStatus)
			.then(utils.parseJSON)
			.then(data => {
				console.log(data);
				this.setState({ data: data.tickets });
			})
			.catch(err => console.log(err));
	}

	componentDidMount() {
		this.loadData();
	}
	
	render() {
		return (
			<div className="App">
				<div>
					{this.state.data.map(data =>
						<div className="listing" key={data.TICKET_ID}>{data.TITLE} - ${data.PRICE}</div>
					)}
				</div>
			</div>
		);
	}
}

export default App;
