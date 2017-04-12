import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Auth from '../modules/Auth';
import SmallSpinner from './SmallSpinner';
import config from '../config';
import fetchUtils from '../utils/fetch';
import textUtils from '../utils/text';
import 'whatwg-fetch';
import './css/Register.css';


class Register extends Component {
	constructor(props) {
		super(props);
		this.register = this.register.bind(this);
		this.state = {
			error: null,
			ready: true
		};
	}

	componentWillMount() {
		if (Auth.isUserAuthenticated()) this.props.history.replace('/');
	}

	register(e) {
		this.setState({
			error: null,
			ready: false
		});
		e.preventDefault();
		const t = e.target;

		const username = t.username.value.trim(),
				email = t.email.value.trim(),
				password = t.password.value;

		if (!username) {
			t.username.className += ' uk-form-danger';
			return;
		} else if (!email || !textUtils.validateEmail(email)) {
			t.email.className += ' uk-form-danger';
			return;
		} else if (!password || password.length < 8) {
			t.password.className += ' uk-form-danger';
			return;
		}

		fetch(config.apiUrl + '/auth/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			mode: 'cors',
			body: JSON.stringify({
				username,
				email,
				password
			})
		})
		.then(fetchUtils.checkStatus)
		.then(fetchUtils.parseJSON)
		.then(data => {
			this.setState({ ready: true });
			const token = data.token;
			Auth.authenticateUser(token);
			this.props.history.push('/');
		})
		.catch(err => {
			console.log(err)
			this.setState({
				error: err.message,
				ready: true
			});
		});
	}

	render() {
		return ( 
			<div className="uk-position-center">
				<form id="register-form" className="uk-animation-slide-top-small" onSubmit={this.register}>
					<div className="uk-margin">
						<h3 className="uk-text-center">Sign up for ETES</h3>
					</div>
					<div className="uk-margin">
						<div className="uk-inline uk-width-1">
							<span className="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: user"></span>
							<input className="uk-input" type="text" placeholder="Username" name="username" autoFocus="true" required/>
						</div>
					</div>
					<div className="uk-margin">
						<div className="uk-inline uk-width-1">
							<span className="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: mail"></span>
							<input className="uk-input" type="email" placeholder="Email" name="email" required/>
						</div>
					</div>

					<div className="uk-margin">
						<div className="uk-inline uk-width-1">
							<span className="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: lock"></span>
							<input className="uk-input" type="password" placeholder="Password" name="password" required minLength="8"/>
						</div>
					</div>

					{this.state.error &&
						<p className="uk-text-center uk-text-small">{this.state.error}</p>
					}

					{this.state.ready ?
						<button className="uk-button uk-button-primary uk-width-1-1">Register</button>
						:
						<SmallSpinner />
					}
					<p className="uk-text-center">Already a member? <Link to="/login">Login</Link></p>
				</form>
			</div>
		);
	}
}

export default Register;
