import React, { Component } from 'react';
import TicketsTable from './TicketsTable';
import Spinner from './Spinner';
import config from '../config';
import utils from '../utils/fetch';
import 'whatwg-fetch';
import auth from '../modules/Auth';
import OrderRow from './OrderRow';


class Orders extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			count: 0,
			ready: false
		};
	}

	componentDidMount() {
		this.loadData();
	}

	loadData() {
		this.setState({ ready: false });
		fetch(config.apiUrl + '/orders?limit=20', {
            headers:{
				'Content-Type':'application/json',
				Authorization: 'Bearer ' + auth.getToken()
			}
        })
			.then(utils.checkStatus)
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
					<TicketsTable data={this.state.data} count={this.state.count} row={OrderRow} />
				}
			</div>
		);
	}
}

export default Orders;
