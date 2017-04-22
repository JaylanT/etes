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
import './css/Register.css';


class Register extends Component {
	constructor(props) {
		super(props);
		this.register = this.register.bind(this);
		this.checkPassword = debounce(this.checkPassword.bind(this), 350);
		this.setInputValue = this.setInputValue.bind(this);
		this.state = {
			error: null,
			ready: true,
			passwordsMatch: true
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
				password = t.password.value,
				confirmPassword = t.confirmPassword.value;

		const validation = this.validateForm(t, username, email, password, confirmPassword);
		if (!validation.isValid) {
			this.setState({
				error: validation.error,
				ready: true
			});
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
			this.setState({
				error: err.message,
				ready: true
			});
		});
	}
	
	validateForm(t, username, email, password, confirmPassword) {
		const validation = {
			isValid: true,
			error: ''
		};

		if (!username) {
			t.username.classList.add('uk-form-danger');
			validation.isValid = false;
			validation.error = 'Please enter a username.';
		} else if (!email || !textUtils.validateEmail(email)) {
			t.email.classList.add('uk-form-danger');
			validation.isValid = false;
			validation.error = 'Please enter a valid email.';
		} else if (!password || password.length < 8) {
			t.password.classList.add('uk-form-danger');
			validation.isValid = false;
			validation.error = 'Passwords must be at least 8 characters';
		} else if (confirmPassword !== password) {
			t.confirmPassword.classList.add('uk-form-danger');
			validation.isValid = false;
			validation.error = 'Passwords do not match.';
		}

		return validation;
	}

	setInputValue(e) {
		const t = e.target;
		this.setState({ [t.name]: t.value }, this.checkPassword);
	}
	
	checkPassword() {
		if (this.state.confirmPassword && this.state.password !== this.state.confirmPassword) {
			this.setState({ 
				passwordsMatch: false,
				error: 'Passwords do not match.'
			});
		} else {
			this.setState({
				passwordsMatch: true,
				error: null
			});
		}
	}
	
	getConfirmPasswordClass() {
		let className = 'uk-input ';
		className += this.state.passwordsMatch ? '' : 'uk-form-danger';
		return className;
	}

	render() {
		return ( 
			<form id="register-container" className="uk-animation-slide-top-small uk-margin-large-bottom" onSubmit={this.register}>
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
						<input className="uk-input" type="password" placeholder="Password" name="password" onInput={this.setInputValue} required minLength="8"/>
					</div>
				</div>
				<div className="uk-margin">
					<div className="uk-inline uk-width-1">
						<span className="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: lock"></span>
						<input className={this.getConfirmPasswordClass()} type="password" placeholder="Confirm password" name="confirmPassword" onInput={this.setInputValue} required minLength="8"/>
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
		);
	}
}

Register.propTypes = {
	history: PropTypes.object.isRequired
};

export default Register;
