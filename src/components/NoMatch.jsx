import React from 'react';
import { Redirect } from 'react-router';


export default class Logout extends React.Component {
	render() {
		return <Redirect to="/" />;
	}
}
