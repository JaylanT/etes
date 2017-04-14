import React, { Component } from 'react';
import Navbar from './Navbar';
import Home from './Home';
import Tickets from './Tickets';
import Search from './Search';
import Register from './Register';
import Login from './Login';
import Logout from './Logout';
import NoMatch from './NoMatch';
import Create from './Create';
import { Route, Switch } from 'react-router-dom';


class Base extends Component {
	render() {
		return (
			<div>
				<Route component={Navbar} />
				<div className="uk-container uk-container-expand">
					<Switch>
						<Route exact path='/' component={Home} />
						<Route path="/music" component={props => <Tickets category="Music" location={props.location} />} />
						<Route path="/sports" component={props => <Tickets category="Sports" location={props.location} />} />
						<Route path="/arts" component={props => <Tickets category="Arts & Theater" location={props.location} />} />
						<Route path="/family" component={props => <Tickets category="Family" location={props.location} />} />
						<Route path="/other" component={props => <Tickets category="Other" location={props.location} />} />
						<Route path="/search" component={Search} />
						<Route path="/register" component={Register} />
						<Route path="/login" component={Login} />
						<Route path="/logout" component={Logout} />
						<Route path="/create" component={Create} />
						<Route component={NoMatch} />
					</Switch>
				</div>
			</div>
		);
	}
}

export default Base;
