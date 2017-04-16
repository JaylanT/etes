import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TicketsTable from './TicketsTable';
import Paginator from './Paginator';
import Spinner from './Spinner';
import config from '../config';
import utils from '../utils/fetch';
import parse from 'parse-link-header';
import qs from 'qs';
import 'whatwg-fetch';


class Tickets extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			page: qs.parse(props.history.location.search.substring(1)).page || 1,
			count: 0,
			ready: false,
			category: props.category
		};
	}

	componentDidMount() {
		this.loadData();
	}
	
	componentWillReceiveProps(nextProps) {
		const page = qs.parse(nextProps.history.location.search.substring(1)).page;
		this.setState({ category: nextProps.category, page }, () => this.loadData());
	}

	loadData() {
		this.setState({ ready: false });
		const url = `${config.apiUrl}/tickets?limit=10&category=${encodeURIComponent(this.state.category)}&page=${this.state.page}`;
		fetch(url)
			.then(utils.checkStatus)
			.then(res => {
				const links = res.headers.get('link');
				const parsed = parse(links);
				const nextPage = parsed.next.page,
						prevPage = parsed.previous.page;
				this.setState({
					nextPage: nextPage ? '?page=' + nextPage : '',
					prevPage: prevPage ? '?page=' + prevPage : ''
				});
				return res;
			})
			.then(utils.parseJSON)
			.then(data => {
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
				<h3 className="uk-animation-fade uk-animation-fast">{this.state.category}</h3>
				{!this.state.ready ?
					<Spinner />
					:
					<div>
						<TicketsTable data={this.state.data} count={this.state.count} />
						<Paginator history={this.props.history} prevPage={this.state.prevPage} nextPage={this.state.nextPage} />				
					</div>
				}
			</div>
		);
	}
}

Tickets.propTypes = {
	category: PropTypes.string,
	history: PropTypes.object
};

export default Tickets;
