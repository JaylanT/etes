import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paginator from './Paginator';
import TicketsTable from './TicketsTable';
import SellingRow from './SellingRow';
import Spinner from './Spinner';
import config from '../config';
import utils from '../utils/fetch';
import 'whatwg-fetch';
import auth from '../modules/Auth';
import parse from 'parse-link-header';
import qs from 'qs';


class Selling extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			page: qs.parse(props.location.search.substring(1)).page || 1,
			count: 0,
			ready: false
		};
		this.showActive = this.showActive.bind(this);
		this.showSold = this.showSold.bind(this);
		this.activeTab = this.activeTab.bind(this);
	}

	componentWillMount() {
		if(!auth.isUserAuthenticated()) this.props.history.replace('/');
	}
	
	componentWillReceiveProps(nextProps) {
		const page = qs.parse(nextProps.location.search.substring(1)).page;
		this.setState({ category: nextProps.category, page }, () => this.loadData());
	}

	componentDidMount() {
		this.loadData();
	}

	loadData() {
		this.setState({ ready: false });
		const status = qs.parse(this.props.location.search.substring(1)).status;
		const url = `${config.apiUrl}/${status === 'sold' ? 'sold' : 'selling'}?limit=10&page=${this.state.page}`;
		fetch(url, {
			headers: {
				'Content-Type':'application/json',
				Authorization: 'Bearer ' + auth.getToken()
			}
		})
			.then(utils.checkStatus)
			.then(res => {
				const links = res.headers.get('link');
				const parsed = parse(links);
				const nextPage = parsed.next.page,
						prevPage = parsed.previous.page;
				this.setState({
					nextPage: nextPage ? `?status=${status}&page=${nextPage}` : '',
					prevPage: prevPage ? `?status=${status}&page=${prevPage}` : ''
				});
				return res;
			})
			.then(utils.parseJSON)
			.then(data => {
				this.setState({
					ready: true,
					data: data.tickets,
					count: data.count,
					revenue: data.revenue
				});
			})
			.catch(err => console.log(err));
	}

	showActive() {
		this.props.history.push('?status=active');
	}

	showSold() {
		this.props.history.push('/selling?status=sold');
	}

	activeTab(tab) {
		const status = qs.parse(this.props.location.search.substring(1)).status;
		return status === tab ? 'uk-active' : '';	
	}

	render() {
		return (
			<div className="uk-margin-top uk-margin-large-bottom">
				<h3 className="uk-animation-fade uk-animation-fast uk-heading-line"><span>Selling</span></h3>
				<ul data-uk-tab>
					<li className={this.activeTab('active')} onClick={this.showActive}><a>Active</a></li>
					<li className={this.activeTab('sold')} onClick={this.showSold}><a>Sold</a></li>
				</ul>
				{!this.state.ready ?
					<Spinner />
					:
					<div>
						{this.state.revenue >= 0 &&
								<h4 className="uk-animation-slide-left-small uk-text-right">Total revenue: ${this.state.revenue.toFixed(2)}</h4>}
						<TicketsTable data={this.state.data} count={this.state.count} row={SellingRow} />
						<Paginator prevPage={this.state.prevPage} nextPage={this.state.nextPage} />				
					</div>
				}
			</div>
		);
	}
}

Selling.propTypes = {
	history: PropTypes.object.isRequired,
	location: PropTypes.object.isRequired
};

export default Selling;
