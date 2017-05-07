import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
				<h3 className="uk-animation-fade uk-animation-fast uk-heading-line"><span>Order Details</span></h3>
				{!this.state.ready ?
					<Spinner />
					:
					<div>

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
