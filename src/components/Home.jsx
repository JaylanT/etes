import React, { Component } from 'react';
import TicketsTable from './TicketsTable';
import Spinner from './Spinner';
import config from '../config';
import utils from '../utils/fetch';
import 'whatwg-fetch';


class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			count: 0,
			ready: false
		}
	}

	componentDidMount() {
		this.loadData();
	}

	loadData() {
		this.setState({ ready: false });
		fetch(config.apiUrl + '/tickets')
			.then(utils.checkStatus)
			.then(utils.parseJSON)
			.then(data => {
				//console.log(data);
				this.setState({
					ready: true,
					data: data.tickets || [],
					count: data.count
				});
			})
			.catch(err => console.log(err));
	}

	render() {
		return (
			<div className="uk-container uk-margin-top uk-margin-large-bottom">
				<h3 className="uk-animation-fade uk-animation-fast">Recently Listed</h3>
				{!this.state.ready ?
					<Spinner />
					:
					<TicketsTable data={this.state.data} count={this.state.count} />
				}
			</div>
		);
	}
}

export default Home;
