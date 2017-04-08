import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Auth from '../modules/Auth';


class Navbar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: []
		}
	}

	render() {
		return (
			<nav className="uk-navbar-container" data-uk-navbar>
				<div className="uk-navbar-left">

					<ul className="uk-navbar-nav">
						<Link to="/" className="uk-navbar-item uk-logo">ETES</Link>
					</ul>

				</div>

				<div className="uk-navbar-right">
						{!Auth.isUserAuthenticated() ? 
							<ul className="uk-navbar-nav">
								<li><Link to="/login">Login</Link></li> 
								<li><Link to="/register">Register</Link></li>
							</ul>
							:
							<ul className="uk-navbar-nav">
								<li><Link to="/logout">Logout</Link></li>
							</ul>
						}
				</div>
			</nav>
		);	
	}
}

export default Navbar;
