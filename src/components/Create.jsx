import Auth from '../modules/Auth';
import React, { Component } from 'react';


class Create extends Component {
	constructor(props) {
		super(props);
		this.create = this.create.bind(this);
		this.state = {error: null};
	}

	createticket(e) {
		e.preventDefault(); 
		if(!Auth.isUserAuthenticated()) this.state = {error: true}
		



	}
}

export default Create;
