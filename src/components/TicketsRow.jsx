import { Component } from 'react';
import PropTypes from 'prop-types';
import Auth from '../modules/Auth';


class Row extends Component {
	getFormattedDate(date) {
		const d = new Date(date.split(' ')[0]);
		return d.toLocaleString('en-us', { year: 'numeric', month: 'long', day: 'numeric' });
	}

	getUserId() {
		const token = Auth.getToken(),
			base64url = token.split('.')[1],
			base64 = base64url.replace('-', '+').replace('_', '/'),
			decoded = JSON.parse(window.atob(base64));
		return decoded.sub;
	}
}

Row.propTypes = {
	data: PropTypes.object
};

export default Row;
