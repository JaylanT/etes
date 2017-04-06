import React, { Component } from 'react';
import Navbar from './Navbar';
import Tickets from './Tickets';
import Register from './Register';
import {
	Route,
	Switch
} from 'react-router-dom';


class Base extends Component {
	render() {
		return (
			<div>
				<Navbar/>
				<div className="uk-container uk-container-expand">
					<Switch>
						<Route exact path='/' component={Tickets}/>
						<Route path="/register" component={Register}/>
					</Switch>
				</div>
			</div>
		);
	}
}

export default Base;
