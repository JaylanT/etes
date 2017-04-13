import Auth from '../modules/Auth';
import React, { Component } from 'react';


class Create extends Component {
	constructor(props) {
		super(props);
		this.createTicket = this.createTicket.bind(this);
		this.state = {error: null};
	}

	createTicket(e) {
		e.preventDefault(); 
		if(!Auth.isUserAuthenticated()) this.state = {error: true}
		



	}

	render() {
		return null;
	}
}

export default Create;
