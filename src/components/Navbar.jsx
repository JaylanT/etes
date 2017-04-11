import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Auth from '../modules/Auth';


class Navbar extends Component {
	constructor(props) {
		super(props);
		this.search = this.search.bind(this);
		this.state = {
			data: []
		}
	}

	getUsername() {
		const token = Auth.getToken(),
				base64url = token.split('.')[1],
				base64 = base64url.replace('-', '+').replace('_', '/'),
				decoded = JSON.parse(window.atob(base64));
		return decoded.username;
	}

	focusSearch(e) {
		console.log(e)
	}

	search(e) {
		e.preventDefault();
		const t = e.target;

		const search = t.search.value;
		this.props.history.push('/search?q=' + search);
	}

	render() {
		return (
			<nav className="uk-navbar-container" data-uk-navbar>
				<div className="nav-overlay uk-navbar-left">
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

				<div className="nav-overlay uk-navbar-center uk-visible@m">
					<ul className="uk-navbar-nav">
						<li><Link to="/music" className="uk-navbar-item">Music</Link></li>
						<li><Link to="/sports" className="uk-navbar-item">Sports</Link></li>
						<li><Link to="/arts" className="uk-navbar-item">Arts & Theater</Link></li>
						<li><Link to="/family" className="uk-navbar-item">Family</Link></li>
						<li><Link to="/other" className="uk-navbar-item">Other</Link></li>
						<li>
							<a className="uk-navbar-toggle" data-uk-toggle="target: .nav-overlay; animation: uk-animation-fade" onClick={this.focusSearch}>
								<span className="uk-icon" href="#" data-uk-icon="icon: search"></span>
							</a>
						</li>
					</ul>
				</div>

				<div className="nav-overlay uk-navbar-left uk-flex-1" hidden>
					<div className="uk-navbar-item uk-width-expand">
						<form className="uk-search uk-search-navbar uk-width-1-1" onSubmit={this.search}>
							<input className="uk-search-input" type="search" placeholder="Search..." name="search" autoFocus="true"/>
						</form>
					</div>
					<a className="uk-navbar-toggle" data-uk-close data-uk-toggle="target: .nav-overlay; animation: uk-animation-fade" href="#"></a>
				</div>

				<div className="nav-overlay uk-navbar-right uk-visible@m">
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
