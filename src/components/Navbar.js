import React, { Component } from 'react';
import { Link } from 'react-router-dom';

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
						<li><Link to="/register">Register</Link></li>
					</ul>

				</div>
			</nav>
		);	
	}
}

export default Navbar;
