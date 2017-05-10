import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TicketsTable from './TicketsTable';
import OrderRow from './OrderRow';
import Paginator from './Paginator';
import Spinner from './Spinner';
import config from '../config';
import utils from '../utils/fetch';
import 'whatwg-fetch';
import auth from '../modules/Auth';
import qs from 'qs';
import parse from 'parse-link-header';


class Orders extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			page: qs.parse(props.location.search.substring(1)).page || 1,
			count: 0,
			ready: false
		};
	}

	componentDidMount() {
		this.loadData();
	}
	
	componentWillReceiveProps(nextProps) {
		const page = qs.parse(nextProps.location.search.substring(1)).page;
		this.setState({ category: nextProps.category, page }, () => this.loadData());
	}

	loadData() {
		this.setState({ ready: false });
		fetch(config.apiUrl + `/orders?limit=10&page=${this.state.page}`, {
            headers:{
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
					nextPage: nextPage ? '?page=' + nextPage : '',
					prevPage: prevPage ? '?page=' + prevPage : ''
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
				<h3 className="uk-animation-fade uk-animation-fast uk-heading-line"><span>Orders</span></h3>
				{!this.state.ready ?
					<Spinner />
					:
					<div>
						<TicketsTable data={this.state.data} count={this.state.count} row={OrderRow} />
						<Paginator prevPage={this.state.prevPage} nextPage={this.state.nextPage} />				
					</div>
				}
			</div>
		);
	}
}

Orders.propTypes = {
	location: PropTypes.object.isRequired
};

export default Orders;
