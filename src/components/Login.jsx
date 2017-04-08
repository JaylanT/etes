import React, { Component } from 'react';
import Auth from '../modules/Auth';
import config from '../config';
import fetchUtils from '../utils/fetch';
import textUtils from '../utils/text';
import 'whatwg-fetch';
const UIkit = window.UIkit;


class Login extends Component {
	constructor(props) {
		super(props);
		this.login = this.login.bind(this);
		this.state = { error: null };
	}

	login(e) {
		e.preventDefault();
		const t = e.target;

		const email = t.email.value.trim(),
				password = t.password.value;

		if (!email || !textUtils.validateEmail(email)) {
			t.email.className += " uk-form-danger";
			return;
		}
		if (!password || password.length < 8) {
			t.password.className += " uk-form-danger";
			return;
		}

		fetch(config.apiUrl + '/auth/login', {
			method: 'POST',
			headers: {
				"Content-Type": "application/json"
			},
			mode: 'cors',
			body: JSON.stringify({
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
		.catch(err => {
			console.log(err)
			UIkit.notification('test');
			this.setState({ error: err.message });
		});
	}

	render() {
		return (
			<form className="uk-position-center" onSubmit={this.login}>
				<div className="uk-margin">
					<h3 className="uk-text-center">Sign in to ETES</h3>
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

				{this.state.error &&
					<p className="uk-text-center uk-text-small">{this.state.error}</p>
				}

				<button className="uk-button uk-button-primary uk-width-1-1">Login</button>
			</form>
		);
	}
}

export default Login;
