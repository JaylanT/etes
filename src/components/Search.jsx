import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TicketsTable from './TicketsTable';
import ListingRow from './ListingRow';
import Paginator from './Paginator';
import Spinner from './Spinner';
import config from '../config';
import utils from '../utils/fetch';
import 'whatwg-fetch';
import parse from 'parse-link-header';
import qs from 'qs';


class Search extends Component {
	constructor(props) {
		super(props);
		const params = qs.parse(props.location.search.substring(1));
		this.state = {
			data: [],
			page: params.page || 1,
			count: 0,
			ready: false,
			search: params.q
		};
	}

	componentDidMount() {
		this.loadData();
	}
	
	componentWillReceiveProps(nextProps) {
		const params = qs.parse(nextProps.location.search.substring(1));
		this.setState({ search: params.q, page: params.page }, () => this.loadData());
	}

	loadData() {
		this.setState({ ready: false });
		const url = `${config.apiUrl}/tickets?limit=10&q=${encodeURIComponent(this.state.search)}&page=${this.state.page}`;
		fetch(url)
			.then(utils.checkStatus)
			.then(res => {
				const links = res.headers.get('link');
				const parsed = parse(links);
				const nextPage = parsed.next.page,
						prevPage = parsed.previous.page;
				this.setState({
					nextPage: nextPage ? `?q=${this.state.search}&page=${nextPage}` : '',
					prevPage: prevPage ? `?q=${this.state.search}&page=${prevPage}` : ''
				});
				return res;
			})
			.then(utils.parseJSON)
			.then(data => {
				this.setState({ 
					ready: true,
					data: data.tickets,
					count: data.count
				});
			})
			.catch(err => console.log(err));
	}

	render() {
		return (
			<div className="uk-margin-top uk-margin-large-bottom">
				<h3 className="uk-animation-fade uk-animation-fast uk-heading-line"><span>Results for '{this.state.search}'</span></h3>
				{!this.state.ready ?
				<Spinner />
				:
				<div>
					<TicketsTable data={this.state.data} count={this.state.count} row={ListingRow} />
					<Paginator prevPage={this.state.prevPage} nextPage={this.state.nextPage} />				
				</div>
				}
			</div>
		);
	}
}

Search.propTypes = {
	location: PropTypes.object.isRequired
};

export default Search;
