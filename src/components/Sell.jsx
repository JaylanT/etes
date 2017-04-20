import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Auth from '../modules/Auth';
import SmallSpinner from './SmallSpinner';
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
			category = t.category.value;

		// need to do further validation
		if (!title || !description || !price || !category) {
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
				category
			})
		})
		.then(fetchUtils.checkStatus)
		.then(fetchUtils.parseJSON)
		.then(() =>{
			this.props.history.push('/');
		})
		.catch(err=>{
			this.setState({
				error: err.message,
				ready: true
			});
		});
	}

	render() {
		return (
			<div id="sell-container" className="uk-container uk-animation-fade uk-animation-fast uk-margin-top">
				<div className="uk-margin">
					<h3 className="uk-heading-line"><span>Sell</span></h3>
				</div>
				<form className="uk-grid-small" onSubmit={this.createTicket} data-uk-grid>
					<div className="uk-width-1-1">
						<input className="uk-input" type="text" placeholder="Title" name="title" autoFocus="true" required/>
					</div>
					<div className="uk-width-1-1">
						<textarea className="uk-textarea" rows="5" placeholder="Description" name="description"></textarea>
					</div>
					<div className="uk-margin-small-top uk-width-1-1"></div>
					<div className="uk-width-1-2@m">
						<select className="uk-select" name="category">
							<option value="" disabled selected>Category</option>
							<option value="Music">Music</option>
							<option value="Sports">Sports</option>
							<option value="Arts & Theater">Arts & Theater</option>
							<option value="Family">Family</option>
							<option value="Other">Other</option>
						</select>
					</div>
					<div className="uk-width-1-2@m">
						<input className="uk-input" type="number" min="0" placeholder="$ Price" name="price" required/>
					</div>
					<div className="uk-width-1-1">
						{this.state.ready ?
							<button className="uk-button uk-button-primary uk-align-right uk-width-1-1 uk-margin-small-top">List</button>
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
