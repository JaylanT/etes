import React, { Component } from 'react'
import TicketsTable from './TicketsTable';
import Spinner from './Spinner';
import config from '../config';
import utils from '../utils/fetch';
import 'whatwg-fetch';


class Tickets extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			count: 0,
			ready: false,
			category: props.category
		}
	}

	componentDidMount() {
		this.loadData();
	}
	
	componentWillReceiveProps(nextProps) {
		this.setState({ category: nextProps.category }, () => this.loadData());
	}

	loadData() {
		this.setState({ ready: false });
		fetch(config.apiUrl + '/tickets?category=' + encodeURIComponent(this.state.category))
			.then(utils.checkStatus)
			.then(utils.parseJSON)
			.then(data => {
				console.log(data);
				this.setState({ 
					ready: true,
					data: data.tickets || [],
					count: data.count
				});
			})
			.catch(err => console.log(err));
	}

	render() {
		return !this.state.ready ?
			<Spinner />
			:
			<TicketsTable tableHeader={this.state.category} data={this.state.data} count={this.state.count} />
	}
}

export default Tickets;
