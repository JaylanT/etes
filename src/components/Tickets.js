import React, { Component } from 'react';
import Spinner from './Spinner';
import config from '../config';
import utils from '../utils/fetch-utils';
import 'whatwg-fetch';


class Tickets extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			ready: false
		}
	}

	loadData() {
		this.setState({ ready: false });
		fetch(config.apiUrl + '/tickets')
			.then(utils.checkStatus)
			.then(utils.parseJSON)
			.then(data => {
				console.log(data);
				this.setState({ 
					ready: true,
					data: data.tickets	
				});
			})
			.catch(err => console.log(err));
	}

	componentDidMount() {
		this.loadData();
	}
	
	render() {
		return (
			<div>
				{!this.state.ready &&
					<Spinner/>
				}
				<div className="uk-text-center">
					{this.state.data.map(data =>
						<div className="listing" key={data.TICKET_ID}>{data.TITLE} - ${data.PRICE}</div>
					)}
				</div>
			</div>
		);
	}
}

export default Tickets;
