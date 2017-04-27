import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Auth from '../modules/Auth';
import Spinner from './Spinner';
import AddressForm from './AddressForm';
import config from '../config';
import fetchUtils from '../utils/fetch';
import 'whatwg-fetch';


class PurchaseTicket extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			ready: false,
			isEditingBilling: true
		};
		this.submitBilling = this.submitBilling.bind(this);
		this.editBilling = this.editBilling.bind(this);
		this.purchaseTicket = this.purchaseTicket.bind(this);
	}

	componentDidMount() {
		this.loadData();
	}

	loadData() {
		this.setState({ ready: false });
		const url = `${config.apiUrl}/tickets/${this.props.match.params.id}`;
		fetch(url)
			.then(fetchUtils.checkStatus)
			.then(fetchUtils.parseJSON)
			.then(data => {
				this.setState({ 
					ready: true,
					data
				});
			})
			.catch(err => console.log(err));
	}

	submitBilling(e) {
		e.preventDefault();
		const t = e.target;

		const cardType = t.cardType.value,
			cardNumber = t.cardNumber.value,
			cardName = t.cardName.value,
			cardDate = t.cardDate.value,
			cardSecurity = t.cardSecurity.value;

		const billingName = t.name.value,
			billingAddressLine1 = t.addressLine1.value,
			billingAddressLine2 = t.addressLine2.value,
			billingCity = t.city.value,
			billingState = t.state.value,
			billingZip = t.zip.value;

		this.setState({
			isEditingBilling: false,
			cardType,
			cardNumber,
			cardName,
			cardDate,
			cardSecurity,
			billingName,
			billingAddressLine1,
			billingAddressLine2,
			billingCity,
			billingState,
			billingZip
		});
	}

	purchaseTicket(e) {
		e.preventDefault();
		const t = e.target;

		const shippingName = t.name.value,
			shippingAddressLine1 = t.addressLine1.value,
			shippingAddressLine2 = t.addressLine2.value,
			shippingCity = t.city.value,
			shippingState = t.state.value,
			shippingZip = t.zip.value;

		const url = `${config.apiUrl}/tickets/${this.props.match.params.id}/purchase`; 
		fetch(url, {
			method:'POST',
			headers: {
				'Content-Type':'application/json',
				Authorization: 'Bearer ' + Auth.getToken()
			},
			body: JSON.stringify({
				name: shippingName,
				addressLine1: shippingAddressLine1,
				addressLine2: shippingAddressLine2,
				city: shippingCity,
				state: shippingState,
				zip: shippingZip
			})
		})
		.then(fetchUtils.checkStatus)
		.then(fetchUtils.parseJSON)
		.then(() => {
			this.props.history.push('/');
		})
		.catch(err => {
			console.log(err);
			this.setState({
				error: err.message,
				ready: true
			});
		});
	}

	editBilling() {
		this.setState({
			isEditingBilling: true
		});
	}

	renderBillingForm() {
		return (
			<div>
				<form className="uk-grid-small uk-form-stacked uk-animation-slide-left-small" onSubmit={this.submitBilling} data-uk-grid>
					<div className="uk-width-1-2@m uk-padding-small">
						<h4>Payment Information</h4>
						<div className="uk-grid-small" data-uk-grid>
							<div className="uk-width-1-1">
								<label className="uk-form-label" htmlFor="card-select">Card Type</label>
								<select id="card-select" className="uk-select uk-width-1-3@m" name="cardType" defaultValue={this.state.cardType || ''} required>
									<option value="" disabled>Select</option>
									<option value="Visa">Visa</option>
									<option value="MasterCard">MasterCard</option>
									<option value="American Express">American Express</option>
									<option value="Discover">Discover</option>
								</select>
							</div>
							<div className="uk-width-1-2@m">
								<label className="uk-form-label" htmlFor="card-number-input">Card Number</label>
								<input id="card-number-input" className="uk-input" type="number" name="cardNumber" defaultValue={this.state.cardNumber} required/>
							</div>
							<div className="uk-width-1-2@m">
								<label className="uk-form-label" htmlFor="card-name-input">Full Name</label>
								<input id="card-name-input" className="uk-input" type="text" name="cardName" defaultValue={this.state.cardName} required/>
							</div>
							<div className="uk-width-1-4@m uk-width-1-5@l uk-width-1-6@xl">
								<label className="uk-form-label" htmlFor="card-date-input">Expiration Date</label>
								<input id="card-date-input" className="uk-input" type="text" name="cardDate" placeholder="MM/YY" defaultValue={this.state.cardDate} required/>
							</div>
							<div className="uk-width-1-4@m uk-width-1-5@l uk-width-1-6@xl">
								<label className="uk-form-label" htmlFor="card-security-input">Security Code</label>
								<input id="card-security-input" className="uk-input" type="number" name="cardSecurity" defaultValue={this.state.cardSecurity} required/>
							</div>
						</div>
					</div>
					<div className="uk-width-1-2@m uk-padding-small">
						<h4>Billing Address</h4>
						<AddressForm
							name={this.state.billingName}
							addressLine1={this.state.billingAddressLine1}
							addressLine2={this.state.billingAddressLine2}
							city={this.state.billingCity}
							state={this.state.billingState}
							zip={this.state.billingZip}
						/>
					</div>
					<div className="uk-width-1-1 uk-padding-small uk-padding-remove-top">
						<button className="uk-button uk-button-primary uk-align-right">Next</button>
					</div>
				</form>
			</div>
		);
	}

	renderShippingForm() {
		return (
			<form className="uk-grid-small uk-form-stacked uk-animation-slide-left-small" onSubmit={this.purchaseTicket} data-uk-grid>
				<div className="uk-width-1-2@m">
					<h4>Billing Information</h4>
					<b>Card Number</b>
					<p>{this.state.cardNumber}</p>
					<b>Billing Address</b>
					<p>
						{this.state.billingName}<br/>
						{this.state.billingAddressLine1}<br/>
						{this.state.billingAddressLine2 ?
							<span>{this.state.billingAddressLine2}<br/></span>
							:
							''
						}
						{this.state.billingCity}, {this.state.billingState} {this.state.billingZip}
					</p>
				</div>
				<div className="uk-width-1-2@m uk-padding-small">
					<h4>Shipping Address</h4>
					<AddressForm />
				</div>
				<div className="uk-width-1-1 uk-padding-small uk-padding-remove-top">
					<a className="uk-button uk-button-primary uk-align-left" onClick={this.editBilling}>Edit Billing</a>
					<button className="uk-button uk-button-primary uk-align-right">Place Order</button>
				</div>
			</form>
		);
	}

	render() {
		return (
			<div className="uk-margin-top uk-margin-large-bottom">
				{!this.state.ready ?
					<Spinner />
					:
					<div className="uk-margin">
						<h3 className="uk-heading-line uk-animation-fade uk-animation-fast"><span>Purchase <span>'{this.state.data.TITLE}'</span> ticket</span></h3>
						{this.state.isEditingBilling ?
							this.renderBillingForm()
							:
							this.renderShippingForm()
						}
					</div>
				}
			</div>
		);
	}
}

PurchaseTicket.propTypes = {
	match: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired
};

export default PurchaseTicket;
