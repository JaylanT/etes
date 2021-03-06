import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Auth from '../modules/Auth';
import SmallSpinner from './SmallSpinner';
import config from '../config';
import fetchUtils from '../utils/fetch';
import textUtils from '../utils/text';
import qs from 'qs';
import 'whatwg-fetch';
import './css/Login.css';


class Login extends Component {
	constructor(props) {
		super(props);
		this.login = this.login.bind(this);
		this.state = {
			error: null,
			ready: true
		};
	}

	componentWillMount() {
		if (Auth.isUserAuthenticated()) this.props.history.replace('/');
	}

	login(e) {
		this.setState({
			error: null,
			ready: false
		});
		e.preventDefault();
		const t = e.target;

		const email = t.email.value.trim(),
				password = t.password.value;

		if (!email || !textUtils.validateEmail(email)) {
			t.email.classList.add('uk-form-danger');
			return;
		} else if (!password || password.length < 8) {
			t.password.classList.add('uk-form-danger');
			return;
		}

		fetch(config.apiUrl + '/auth/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
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
			this.setState({ ready: true });
			const token = data.token;
			Auth.authenticateUser(token);

			const redirect = qs.parse(this.props.location.search.substring(1)).redirect;
			if (redirect) {
				this.props.history.push(redirect);
			} else {
				this.props.history.push('/');
			}
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
			<form id="login-container" className="uk-animation-slide-top-small uk-margin-large-bottom" onSubmit={this.login}>
				<div className="uk-margin">
					<h3 className="uk-text-center">Sign in to ETES</h3>
				</div>
				<div className="uk-margin">
					<div className="uk-inline uk-width-1">
						<span className="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: mail"></span>
						<input className="uk-input" type="email" placeholder="Email" name="email" autoFocus="true" required/>
					</div>
				</div>

				<div className="uk-margin">
					<div className="uk-inline uk-width-1">
						<span className="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: lock"></span>
						<input className="uk-input" type="password" placeholder="Password" name="password" required minLength="8"/>
					</div>
				</div>

				{this.state.error &&
					<p className="uk-text-center uk-text-small uk-animation-fade uk-animation-fast">{this.state.error}</p>
				}

				{this.state.ready ?
					<button className="uk-button uk-button-primary uk-width-1-1">Login</button>
					:
					<SmallSpinner />
				}
				<p className="uk-text-center">Need an account? <Link to="/register">Register</Link></p>
			</form>
		);
	}
}

Login.propTypes = {
	history: PropTypes.object.isRequired,
	location: PropTypes.object.isRequired
};

export default Login;
