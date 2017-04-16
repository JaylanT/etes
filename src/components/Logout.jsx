import { Component } from 'react';
import PropTypes from 'prop-types';
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

Logout.propTypes = {
	history: PropTypes.object.isRequired
};

export default Logout;
