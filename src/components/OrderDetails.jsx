import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MapDirections from './MapDirections';
import Spinner from './Spinner';
import config from '../config';
import utils from '../utils/fetch';
import auth from '../modules/Auth';
import 'whatwg-fetch';


class OrderDetails extends Component {
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
		const url = `${config.apiUrl}/orders/${this.props.match.params.id}`;
		fetch(url, {
            headers:{ Authorization: 'Bearer ' + auth.getToken() }
        })
			.then(utils.checkStatus)
			.then(utils.parseJSON)
			.then(data => {
				console.log(data);
				const origin = `${data.SELLER_ADDRESS_LINE_1}, ${data.SELLER_CITY} ${data.SELLER_STATE}`;
				const destination = `${data.SHIP_ADDRESS_LINE_1}, ${data.SHIP_CITY} ${data.SHIP_STATE}`;
				this.setState({
					ready: true,
					data,
					origin,
					destination
				});
			})
			.catch(err => console.log(err));
	}

	getFormattedDate(date) {
		const d = new Date(date.split(' ')[0]);
		return d.toLocaleString('en-us', { year: 'numeric', month: 'long', day: 'numeric' });
	}

	render() {
		const data = this.state.data;
		return (
			<div className="uk-margin-top uk-margin-large-bottom">
				<h3 className="uk-animation-fade uk-animation-fast uk-heading-line"><span>Order Details</span></h3>
				{!this.state.ready ?
					<Spinner />
					:
					<div className="uk-grid-small uk-animation-slide-left-small" data-uk-grid>
						<div className="uk-width-1-2@m uk-padding-small">
							<h3>{data.TITLE}</h3>
							<div className="uk-grid-small" data-uk-grid>
								<div className="uk-width-1-3@m">
									<h4>Order Total</h4>
									<strong>${data.TOTAL_PRICE}</strong>
								</div>
								<div className="uk-width-1-2@m">
									<h4>Placed On</h4>
									<p>{this.getFormattedDate(data.DATE_ORDERED)}</p>
								</div>
							</div>
							<h4>Shipping Address</h4>
							<p>
								<strong>{data.SHIP_NAME}</strong><br/>
								{data.SHIP_ADDRESS_LINE_1}<br/>
								{data.SHIP_ADDRESS_LINE_2 &&
									<span>{data.SHIP_ADDRESS_LINE_2}<br/></span>
								}
								{data.SHIP_CITY}, {data.SHIP_STATE} {data.SHIP_ZIP}
							</p>
							<h4>Delivery ETA</h4>
							<strong>{data.SHIP_TIME}</strong>
						</div>
						<div className="uk-width-1-2@m uk-padding-small">
							<MapDirections origin={this.state.origin} destination={this.state.destination} />
						</div>
					</div>
				}
			</div>
		);
	}
}

OrderDetails.propTypes = {
	match: PropTypes.object.isRequired
};

export default OrderDetails;
