import React, { Component } from 'react';

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
						<a href="" className="uk-navbar-item uk-logo">ETES</a>
						<li>
							<a href="#">Parent</a>
							<div className="uk-navbar-dropdown">
								<ul className="uk-nav uk-navbar-dropdown-nav">
									<li><a href="#">Item</a></li>
									<li><a href="#">Item</a></li>
								</ul>
							</div>
						</li>
						<li><a href="#">Item</a></li>
					</ul>

				</div>
			</nav>
		);	
	}
}

export default Navbar;
