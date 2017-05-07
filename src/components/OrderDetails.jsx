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
            headers:{
					'Content-Type':'application/json',
					Authorization: 'Bearer ' + auth.getToken()
				}
        })
			.then(utils.checkStatus)
			.then(utils.parseJSON)
			.then(data => {
				console.log(data);
				const origin = `${data.SELLER_ADDRESS_LINE_1}, ${data.SELLER_CITY} ${data.SELLER_STATE}`;
				const destination = `${data.SHIP_ADDRESS_LINE_1}, ${data.SHIP_CITY} ${data.SHIP_STATE}`;
				this.setState({
					ready: true,
					data: data.tickets,
					origin,
					destination
				});
			})
			.catch(err => console.log(err));
	}

	render() {
		return (
			<div className="uk-margin-top uk-margin-large-bottom">
				<h3 className="uk-animation-fade uk-animation-fast uk-heading-line"><span>Order Details</span></h3>
				{!this.state.ready ?
					<Spinner />
					:
					<div className="uk-grid-small">
						<div className="uk-width-1-2@m">
							<MapDirections origin={this.state.origin} destination={this.state.destination} />
						</div>
						<div className="uk-width-1-2@m">
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
