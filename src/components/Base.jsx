import React, { Component } from 'react';
import Navbar from './Navbar';
import Home from './Home';
import Tickets from './Tickets';
import Register from './Register';
import Login from './Login';
import Logout from './Logout';
import {
	Route,
	Switch
} from 'react-router-dom';


class Base extends Component {
	render() {
		return (
			<div>
				<Navbar />
				<div className="uk-container uk-container-expand">
					<Switch>
						<Route exact path='/' component={Home} />
						<Route path="/music" render={()=><Tickets category="Music" />} />
						<Route path="/sports" render={()=><Tickets category="Sports" />} />
						<Route path="/arts" render={()=><Tickets category="Arts & Theater" />} />
						<Route path="/family" render={()=><Tickets category="Family" />} />
						<Route path="/other" render={()=><Tickets category="Other" />} />
						<Route path="/register" component={Register} />
						<Route path="/login" component={Login} />
						<Route path="/logout" component={Logout} />
					</Switch>
				</div>
			</div>
		);
	}
}

export default Base;
