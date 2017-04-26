import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Auth from '../modules/Auth';
import SmallSpinner from './SmallSpinner';
import AddressForm from './AddressForm';
import config from '../config';
import fetchUtils from '../utils/fetch';
import 'whatwg-fetch';
import './css/Sell.css';


class Sell extends Component {
	constructor(props) {
		super(props);
		this.createTicket = this.createTicket.bind(this);
		this.state = {
			error: null,
			ready: true
		};
	}

	componentWillMount() {
		if(!Auth.isUserAuthenticated()) this.props.history.replace('/');
	}

	createTicket(e) {
		this.setState({
			error: null,
			ready: false
		});
		e.preventDefault(); 

		const t = e.target;
		const title = t.title.value.trim(),
			description = t.description.value.trim(),
			price = t.price.value,
			category = t.category.value,
			sellerName = t.name.value,
			sellerAddressLine1 = t.addressLine1.value,
			sellerAddressLine2 = t.addressLine2.value,
			sellerCity = t.city.value,
			sellerState = t.state.value,
			sellerZip = t.zip.value;

		// need to do further validation
		if (!title || !description || !price || !category
			|| !sellerName || !sellerAddressLine1 || !sellerCity
			|| !sellerState || !sellerZip) {
			this.setState({
				ready: true
			});
			return;
		}

		fetch(config.apiUrl + '/tickets', {
			method:'POST',
			headers:{
				'Content-Type':'application/json',
				Authorization: 'Bearer ' + Auth.getToken()
			},
			body: JSON.stringify({
				title,
				description,
				price,
				category,
				sellerName,
				sellerAddressLine1,
				sellerAddressLine2,
				sellerCity,
				sellerState,
				sellerZip
			})
		})
		.then(fetchUtils.checkStatus)
		.then(fetchUtils.parseJSON)
		.then(() => {
			this.props.history.push('/');
		})
		.catch(err => {
			this.setState({
				error: err.message,
				ready: true
			});
		});
	}

	render() {
		return (
			<div id="sell-container" className="uk-margin-top uk-margin-large-bottom">
				<div className="uk-margin">
					<h3 className="uk-heading-line uk-animation-fade uk-animation-fast"><span>Sell</span></h3>
				</div>
				<form className="uk-grid-small uk-form-stacked uk-animation-slide-left-small" onSubmit={this.createTicket} data-uk-grid>
					<div className="uk-width-1-2@m uk-padding-small">
						<h4>Ticket Details</h4>
						<div className="uk-grid-small" data-uk-grid>
							<div className="uk-width-1-1">
								<label className="uk-form-label" htmlFor="title-input">Title</label>
								<input id="title-input" className="uk-input" type="text" name="title" required/>
							</div>
							<div className="uk-width-1-1">
								<label className="uk-form-label" htmlFor="description-input">Description</label>
								<textarea id="description-input" className="uk-textarea" rows="5" placeholder="Event information, venue, etc..." name="description" required></textarea>
							</div>
							<div className="uk-width-1-2@m">
								<label className="uk-form-label" htmlFor="category-select">Category</label>
								<select id="category-select" className="uk-select" name="category" defaultValue={''} required>
									<option value="" disabled>Select</option>
									<option value="Music">Music</option>
									<option value="Sports">Sports</option>
									<option value="Arts & Theater">Arts & Theater</option>
									<option value="Family">Family</option>
									<option value="Other">Other</option>
								</select>
							</div>
							<div className="uk-width-1-2@m">
								<label className="uk-form-label" htmlFor="price-input">Price</label>
								<input id="price-input" className="uk-input" type="number" min="0" placeholder="$" name="price" required/>
							</div>
						</div>
					</div>

					<div className="uk-width-1-2@m uk-padding-small">
						<h4>Address</h4>
						<AddressForm />
					</div>

					<div className="uk-width-1-1 uk-padding-small uk-padding-remove-top">
						{this.state.ready ?
							<button className="uk-button uk-button-primary uk-align-right">List It</button>
							:
							<SmallSpinner />
						}
					</div>
				</form>
			</div>
		);
	}
}

Sell.propTypes = {
	history: PropTypes.object.isRequired
};

export default Sell;
