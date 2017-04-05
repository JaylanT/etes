import React, { Component } from 'react';


class Register extends Component {
	register(e) {
		e.preventDefault();
	}

	render() {
		return (
			<form className="uk-position-center" onSubmit={this.register}>
				<h3 className="uk-text-center">Sign up for ETES</h3>
				<div className="uk-margin">
					<div className="uk-inline">
						<span className="uk-form-icon" data-uk-icon="icon: mail"></span>
						<input className="uk-input" type="text"/>
					</div>
				</div>

				<div className="uk-margin">
					<div className="uk-inline">
						<span className="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: lock"></span>
						<input className="uk-input" type="text"/>
					</div>
				</div>

				<button className="uk-button uk-button-default uk-width-1-1">Register</button>
			</form>
		);
	}
}

export default Register;
