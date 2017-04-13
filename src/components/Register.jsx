import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Auth from '../modules/Auth';
import SmallSpinner from './SmallSpinner';
import config from '../config';
import fetchUtils from '../utils/fetch';
import textUtils from '../utils/text';
import debounce from 'debounce';
import 'whatwg-fetch';
import './css/Register.css';


class Register extends Component {
	constructor(props) {
		super(props);
		this.register = this.register.bind(this);
		this.checkPassword = this.checkPassword.bind(this);
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

		if (!username) {
			t.username.classList.add('uk-form-danger');
			return;
		} else if (!email || !textUtils.validateEmail(email)) {
			t.email.classList.add('uk-form-danger');
			return;
		} else if (!password || password.length < 8) {
			t.password.classList.add('uk-form-danger');
			return;
		} else if (confirmPassword !== password) {
			t.confirmPassword.classList.add('uk-form-danger');
			this.setState({
				error: 'Passwords do not match.',
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

	setInputValue(input) {
		const debounced = debounce(this.checkPassword, 350);
		return e => this.setState({ [input]: e.target.value }, debounced);
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
			<div id="register-container">
				<form className="uk-animation-slide-top-small" onSubmit={this.register}>
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
							<input className="uk-input" type="password" placeholder="Password" name="password" onInput={this.setInputValue('password')} required minLength="8"/>
						</div>
					</div>
					<div className="uk-margin">
						<div className="uk-inline uk-width-1">
							<span className="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: lock"></span>
							<input className={this.getConfirmPasswordClass()} type="password" placeholder="Confirm password" name="confirmPassword" onInput={this.setInputValue('confirmPassword')} required minLength="8"/>
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
