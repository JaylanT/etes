import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Auth from '../modules/Auth';


class Navbar extends Component {
	constructor(props) {
		super(props);
		this.search = this.search.bind(this);
		this.state = {
			data: [],
			currentRoute: props.location.pathname
		}
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

	focusSearch(e) {
		document.getElementById('nav-search').focus();
	}

	search(e) {
		e.preventDefault();
		const t = e.target;
		t.search.blur();

		const search = t.search.value;
		this.props.history.push('/search?q=' + search);
	}

	render() {
		return (
			<nav className="uk-navbar-container" data-uk-navbar>
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
								<Link to="/">ETES</Link>
								<ul className="uk-nav-sub">
									<li><Link to="/music">Music</Link></li>
									<li><Link to="/sports">Sports</Link></li>
									<li><Link to="/arts">Arts & Theater</Link></li>
									<li><Link to="/family">Family</Link></li>
									<li><Link to="/other">Other</Link></li>
								</ul>
							</li>
							<li className="uk-nav-divider"></li>
							{!Auth.isUserAuthenticated() && 
									<li><Link to="/login">Login</Link></li> 
							}
							{!Auth.isUserAuthenticated() && 
									<li><Link to="/register">Register</Link></li>
							}
							{Auth.isUserAuthenticated() && 
									<li><Link to="/profile">{this.getUsername()}</Link></li>
							}
							{Auth.isUserAuthenticated() && 
									<li><Link to="/logout">Logout</Link></li>
							}
						</ul>
					</div>
				</div>

				<div className="uk-navbar-center uk-visible@m">
					<ul className="uk-navbar-nav">
						<li className={this.state.currentRoute === '/music' ? 'uk-active' : ''}>
							<Link to="/music" className="uk-navbar-item">Music</Link>
						</li>
						<li className={this.state.currentRoute === '/sports' ? 'uk-active' : ''}>
							<Link to="/sports" className="uk-navbar-item">Sports</Link>
						</li>
						<li className={this.state.currentRoute === '/arts' ? 'uk-active' : ''}>
							<Link to="/arts" className="uk-navbar-item">Arts & Theater</Link>
						</li>
						<li className={this.state.currentRoute === '/family' ? 'uk-active' : ''}>
							<Link to="/family" className="uk-navbar-item">Family</Link>
						</li>
						<li className={this.state.currentRoute === '/other' ? 'uk-active' : ''}>
							<Link to="/other" className="uk-navbar-item">Other</Link>
						</li>
					</ul>
					<div className="uk-navbar-item">
						<form className="uk-search uk-search-navbar" onSubmit={this.search}>
							<span data-uk-search-icon></span>
							<input className="uk-search-input" type="search" placeholder="Search..." name="search"/>
						</form>
					</div>
				</div>

				<div className="uk-navbar-right uk-visible@m">
						{!Auth.isUserAuthenticated() ? 
							<ul className="uk-navbar-nav">
								<li><Link to="/login">Login</Link></li> 
								<li><Link to="/register">Register</Link></li>
							</ul>
							:
							<ul className="uk-navbar-nav">
								<li><Link to="/profile">{this.getUsername()}</Link></li>
								<li><Link to="/logout">Logout</Link></li>
							</ul>
						}
				</div>
			</nav>
		);	
	}
}

export default Navbar;
