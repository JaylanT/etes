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
						<Route path="/music" render={props => <Tickets category="Music" history={props.history} />} />
						<Route path="/sports" render={props => <Tickets category="Sports" history={props.history} />} />
						<Route path="/arts" render={props => <Tickets category="Arts & Theater" history={props.history} />} />
						<Route path="/family" render={props => <Tickets category="Family" history={props.history} />} />
						<Route path="/other" render={props => <Tickets category="Other" history={props.history} />} />
						<Route path="/search" component={Search} />
						<Route path="/tickets" />
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
