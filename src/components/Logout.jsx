import { Component } from 'react';
import Auth from '../modules/Auth';


class Logout extends Component {
	componentWillMount() {
		Auth.deauthenticateUser();
		this.props.history.push('/');
	}

	render() {
		return null;
	}
}

export default Logout;
