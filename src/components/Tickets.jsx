import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import TicketsTable from './TicketsTable';
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
			page: qs.parse(props.location.search.substring(1)).page || 1,
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
		const url = config.apiUrl + '/tickets?limit=4&category=' + encodeURIComponent(this.state.category) + '&page=' + this.state.page;
		fetch(url)
			.then(utils.checkStatus)
			.then(res => {
				const links = res.headers.get('link');
				const parsed = parse(links);
				this.setState({
					nextPage: '?page=' + parsed.next.page,
					prevPage: '?page=' + parsed.previous.page
				});
				return res;
			})
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

	prevPageLinkClass() {
		let link = '';
		if (this.state.prevPage === '?page=undefined') link += ' uk-hidden';
		return link;
	}

	nextPageLinkClass() {
		let link = 'uk-margin-auto-left';
		console.log(this.state)
		if (this.state.nextPage === '?page=undefined') link += ' uk-hidden';
		return link;
	}

	render() {
		return !this.state.ready ?
			<Spinner />
			:
			<div>
				<TicketsTable tableHeader={this.state.category} data={this.state.data} count={this.state.count} />
				
				<div className="uk-container">
					<ul className="uk-pagination">
						 <li className={this.prevPageLinkClass()}><Link to={this.state.prevPage || ''}><span className="uk-margin-small-right" data-uk-icon="icon: pagination-previous"></span> Previous</Link></li>
						 <li className={this.nextPageLinkClass()}><Link to={this.state.nextPage}>Next <span className="uk-margin-small-left" data-uk-icon="icon : pagination-next"></span></Link></li>
					</ul>
				</div>
			</div>
	}
}

export default Tickets;
