import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Auth from '../modules/Auth';
import './css/Navbar.css';


class Navbar extends Component {
	constructor(props) {
		super(props);
		this.search = this.search.bind(this);
		this.state = { currentRoute: props.location.pathname };
	}

	componentWillReceiveProps(nextProps) {
		this.setState({ currentRoute: nextProps.location.pathname });
	}

	getUsername() {
		const token = Auth.getToken(),
			base64url = token.split('.')[1],
			base64 = base64url.replace('-', '+').replace('_', '/'),
			decoded = JSON.parse(window.atob(base64));
		return decoded.username;
	}

	highlightIfActive(path) {
		return this.state.currentRoute.substring(1) === path ? 'uk-active' : '';
	}

	search(e) {
		e.preventDefault();
		const t = e.target;
		t.search.blur();

		const search = t.search.value;
		if (search) this.props.history.push('/search?q=' + search);
		t.reset();
	}

	render() {
		return (
			<nav className="uk-navbar-container uk-navbar-fixed uk-light" data-uk-navbar>
				<div className="uk-navbar-left">
					<ul className="uk-navbar-nav">
						<a className="uk-navbar-toggle uk-hidden@m" data-uk-icon="icon: menu" data-uk-toggle="target: #offcanvas" href="#"></a>
						<Link to="/" className="uk-navbar-item uk-logo">ETES</Link>
					</ul>
				</div>

				<div id="offcanvas" data-uk-offcanvas="overlay: true">
					<div className="uk-offcanvas-bar uk-flex uk-flex-column">
						<ul className="uk-nav uk-nav-primary uk-nav-center uk-margin-auto-vertical">
							<li className="uk-parent">
								<ul className="uk-nav-sub">
									<li data-uk-toggle="target: #offcanvas"><Link to="/music">Music</Link></li>
									<li data-uk-toggle="target: #offcanvas"><Link to="/sports">Sports</Link></li>
									<li data-uk-toggle="target: #offcanvas"><Link to="/arts">Arts & Theater</Link></li>
									<li data-uk-toggle="target: #offcanvas"><Link to="/family">Family</Link></li>
									<li data-uk-toggle="target: #offcanvas"><Link to="/other">Other</Link></li>
								</ul>
							</li>
							<li className="uk-nav-divider"></li>
							{!Auth.isUserAuthenticated() &&
									<li data-uk-toggle="target: #offcanvas"><Link to="/login">Login</Link></li>
							}
							{!Auth.isUserAuthenticated() && 
									<li data-uk-toggle="target: #offcanvas"><Link to="/register">Register</Link></li>
							}
							{Auth.isUserAuthenticated() && 
									<li data-uk-toggle="target: #offcanvas"><Link to="/sell">Sell</Link></li>
							}
							{Auth.isUserAuthenticated() && 
									<li data-uk-toggle="target: #offcanvas"><Link to="/profile">{this.getUsername()}</Link></li>
							}
							{Auth.isUserAuthenticated() && 
									<li data-uk-toggle="target: #offcanvas"><Link to="/selling">Selling</Link></li>
							}
                            {Auth.isUserAuthenticated() && 
									<li data-uk-toggle="target: #offcanvas"><Link to="/logout">Logout</Link></li>
							}
						</ul>
					</div>
				</div>

				<div className="uk-navbar-center uk-visible@m">
					<ul className="uk-navbar-nav">
						<li className={this.highlightIfActive('music')}>
							<Link to="/music" className="uk-navbar-item">Music</Link>
						</li>
						<li className={this.highlightIfActive('sports')}>
							<Link to="/sports" className="uk-navbar-item">Sports</Link>
						</li>
						<li className={this.highlightIfActive('arts')}>
							<Link to="/arts" className="uk-navbar-item">Arts & Theater</Link>
						</li>
						<li className={this.highlightIfActive('family')}>
							<Link to="/family" className="uk-navbar-item">Family</Link>
						</li>
						<li className={this.highlightIfActive('other')}>
							<Link to="/other" className="uk-navbar-item">Other</Link>
						</li>
					</ul>
					<div className="uk-navbar-item">
						<form className="uk-search uk-search-navbar" onSubmit={this.search}>
							<span data-uk-search-icon></span>
							<input className="uk-search-input" type="search" placeholder="Search..." name="search" />
						</form>
					</div>
				</div>

				<div className="uk-navbar-right uk-hidden@m">
					<div className="uk-navbar-item">
						<form className="uk-search uk-search-navbar uk-width-auto" onSubmit={this.search}>
							<span data-uk-search-icon></span>
							<input className="uk-search-input" type="search" placeholder="Search..." name="search" />
						</form>
					</div>
				</div>

				<div className="uk-navbar-right uk-visible@m">
					{!Auth.isUserAuthenticated() ?
							<ul className="uk-navbar-nav">
								<li className={this.highlightIfActive('login')}><Link to="/login">Login</Link></li>
								<li className={this.highlightIfActive('register')}><Link to="/register">Register</Link></li>
							</ul>
							:
							<ul className="uk-navbar-nav">
								<li className={this.highlightIfActive('sell')}><Link to="/sell">Sell</Link></li>
								<li>
									<a href="#">{this.getUsername()}</a>
									<div className="uk-navbar-dropdown">
										<ul className="uk-nav uk-navbar-dropdown-nav">
											<li><Link to="/profile">Profile</Link></li>
                                            <li><Link to="/selling">Selling</Link></li>
											<li><Link to="/logout">Logout</Link></li>
										</ul>
									</div>
								</li>
							</ul>
					}
				</div>
			</nav>
		);
	}
}

Navbar.propTypes = {
	location: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired
};

export default Navbar;
