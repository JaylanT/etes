import React, { Component } from 'react'
import TicketsTable from './TicketsTable';
import Spinner from './Spinner';
import config from '../config';
import utils from '../utils/fetch';
import 'whatwg-fetch';
import qs from 'qs';


class Search extends Component {
	constructor(props) {
		super(props);
		const search = qs.parse(this.props.location.search.substring(1));
		this.state = {
			data: [],
			count: 0,
			ready: false,
			search: search.q
		}
	}

	componentDidMount() {
		this.loadData();
	}
	
	componentWillReceiveProps(nextProps) {
		const search = qs.parse(nextProps.location.search.substring(1));
		this.setState({ search: search.q }, () => this.loadData());
	}

	loadData() {
		this.setState({ ready: false });
		fetch(config.apiUrl + '/tickets?q=' + encodeURIComponent(this.state.search))
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
			<TicketsTable tableHeader={this.state.search} data={this.state.data} count={this.state.count} />
	}
}

export default Search;
