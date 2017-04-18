import Auth from '../modules/Auth';
import React, { Component } from 'react';
import config from '../config';
import { Link } from 'react-router-dom';
import SmallSpinner from './SmallSpinner';
import fetchUtils from '../utils/fetch';
import textUtils from '../utils/text';
import debounce from 'lodash.debounce';
import 'whatwg-fetch';
// later implemented css 

class Create extends Component {
	constructor(props) {
		super(props);
		this.createTicket = this.createTicket.bind(this);
		this.state = {error: null};
	}

	componentWillMount(){
		if(!Auth.isUserAuthenticated()) this.props.history.replace('/');
	}

	createTicket(e) {
		this.setState({
			error: null,
			ready: false
		});
		e.preventDefault(); 
		if(!Auth.isUserAuthenticated()) return;
		const t = e.target;
		const title = t.title.value.trim(),
			  description = t.description.value.trim(),
			  price = t.price.value,
			  category = t.category.value.trim();
		const validation = this.validateForm(t, title, description,price,category);
		if (!validation.isValid){
			this.setState({
				error: validation.error,
				ready: true
			});
			return;
		}


		fetch(config.apiUrl + '/auth/tickets',{
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
						<h3 className="uk-text-center">Sign up for ETES</h3>
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
				</form>
			</div>
			);
	}
}

export default Create;
