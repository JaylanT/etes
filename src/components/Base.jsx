import React, { Component } from 'react';
import Navbar from './Navbar';
import Home from './Home';
import Tickets from './Tickets';
import Search from './Search';
import Register from './Register';
import Login from './Login';
import Logout from './Logout';
import NoMatch from './NoMatch';
import Sell from './Sell';
import PurchaseTicket from './PurchaseTicket';
import { Route, Switch } from 'react-router-dom';
import './css/Base.css';


class Base extends Component {
	render() {
		return (
			<div>
				<Route component={Navbar} />
				<div id="content" className="uk-container uk-container-large">
					<Switch>
						<Route exact path='/' component={Home} />
						<Route path="/music" render={props => <Tickets category="Music" location={props.location} />} />
						<Route path="/sports" render={props => <Tickets category="Sports" location={props.location} />} />
						<Route path="/arts" render={props => <Tickets category="Arts & Theater" location={props.location} />} />
						<Route path="/family" render={props => <Tickets category="Family" location={props.location} />} />
						<Route path="/other" render={props => <Tickets category="Other" location={props.location} />} />
						<Route path="/search" component={Search} />
						<Route path="/tickets/:id/purchase" component={PurchaseTicket} />
						<Route path="/sell" component={Sell}/>
						<Route path="/register" component={Register} />
						<Route path="/login" component={Login} />
						<Route path="/logout" component={Logout} />
						<Route component={NoMatch} />
					</Switch>
				</div>
			</div>
		);
	}
}

export default Base;
