import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Auth from '../modules/Auth';
import SmallSpinner from './SmallSpinner';
import config from '../config';
import fetchUtils from '../utils/fetch';
import textUtils from '../utils/text';
import debounce from 'lodash.debounce';
import 'whatwg-fetch';
import './css/Create.css';


class Create extends Component {
	constructor(props) {
		super(props);
		this.createTicket = this.createTicket.bind(this);
		this.state = {
			error: null,
			ready: true
		};
	}

	componentWillMount(){
		if(!Auth.isUserAuthenticated()) this.props.history.replace('/');
	}

	createTicket(e) {
		this.setState({
			error: null,
			ready: true
		});
		e.preventDefault(); 
		if(!Auth.isUserAuthenticated()) return;
		const t = e.target;
		const title = t.title.value.trim(),
			  description = t.description.value.trim(),
			  price = t.price.value,
			  category = t.category.value.trim();
		fetch(config.apiUrl + '/api/tickets',{
			method:'POST',
			headers:{
				'Content-Type':'application/json',
				Authorization: Auth.getToken()
			},
			mode: 'cors',
			body: JSON.stringify({
				title,
				description,
				price,
				category
			})

		})
		.then(fetchUtils.checkStatus)
		.then(fetchUtils.parseJSON)
		.then(data =>{
			this.props.history.push('/');
		})
		.catch(err=>{
			this.setstate({
				error: err.message,
				ready: true
			});
		});
	}
	
	
	render() {
		return (
			<div>
				<form className="uk-animation-slide-top-small" onSubmit={this.createTicket}>
					<div className="uk-margin">
						<h3 className="uk-text-center">SELL TICKET</h3>
					</div>
					<div className="uk-margin">
						<div className="uk-inline uk-width-1">
							<input className="uk-input" type="text" placeholder="Title" name="title" autoFocus="true" required/>
						</div>
					</div>
					  <div className="uk-margin">
            <textarea className="uk-textarea" rows="5" placeholder="Description" name="description"></textarea>
        </div>
    	<div className="uk-margin">
        <label className="uk-form-label" htmlFor="form-stacked-select">Select</label>
        <div className="uk-form-controls">
            <select name="category" className="uk-select" id="form-stacked-select">
                <option>Category</option>
                <option value="Music">Music</option>
                <option value="Sports">Sports</option>
                <option value="Other">Other</option>
                <option value="Family">Family</option>
                <option value="Art & Theater">Art & Theater</option>
            </select>
        </div>
    </div>
		<div className="uk-margin">
				<div className="uk-inline uk-width-1">
					<input className="uk-input" type="number" placeholder="Price" name="price" autoFocus="true" required/>
				</div>
		</div>
		{this.state.ready ?
					    <button className="uk-button uk-button-primary ">Submit Ticket</button>
						:
						<SmallSpinner />
					}
				</form>
			</div>
			);
	}
}
Create.propTypes = {
	history: PropTypes.object.isRequired
};
export default Create;
