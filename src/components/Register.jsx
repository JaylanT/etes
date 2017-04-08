import React, { Component } from 'react';
import Auth from '../modules/Auth';
import config from '../config';
import fetchUtils from '../utils/fetch';
import textUtils from '../utils/text';
import 'whatwg-fetch';


class Register extends Component {
	constructor(props) {
		super(props);
		this.register = this.register.bind(this);
	}

	register(e) {
		e.preventDefault();
		const t = e.target;

		const name = t.name.value.trim(),
				email = t.email.value.trim(),
				password = t.password.value;

		if (!name) {
			t.name.className += " uk-form-danger";
			return;
		}
		if (!email || !textUtils.validateEmail(email)) {
			t.email.className += " uk-form-danger";
			return;
		}
		if (!password || password.length < 8) {
			t.password.className += " uk-form-danger";
			return;
		}

		fetch(config.apiUrl + '/auth/register', {
			method: 'POST',
			headers: {
				"Content-Type": "application/json"
			},
			mode: 'cors',
			body: JSON.stringify({
				name,
				email,
				password
			})
		})
		.then(fetchUtils.checkStatus)
		.then(fetchUtils.parseJSON)
		.then(data => {
			const token = data.token;
			Auth.authenticateUser(token);
			this.props.history.push('/');
		})
		.catch(err => console.log(err));
	}

	render() {
		return (
			<form className="uk-position-center" onSubmit={this.register}>
				<div className="uk-margin">
					<h3 className="uk-text-center">Sign up for ETES</h3>
				</div>
				<div className="uk-margin">
					<div className="uk-inline">
						<span className="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: user"></span>
						<input className="uk-input" type="text" placeholder="Name" name="name" required/>
					</div>
				</div>
				<div className="uk-margin">
					<div className="uk-inline">
						<span className="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: mail"></span>
						<input className="uk-input" type="email" placeholder="Email" name="email" required/>
					</div>
				</div>

				<div className="uk-margin">
					<div className="uk-inline">
						<span className="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: lock"></span>
						<input className="uk-input" type="password" placeholder="Password" name="password" required minLength="8"/>
					</div>
				</div>

				<button className="uk-button uk-button-primary uk-width-1-1">Register</button>
			</form>
		);
	}
}

export default Register;
