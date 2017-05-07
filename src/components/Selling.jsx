import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TicketsTable from './TicketsTable';
import SellingRow from './SellingRow';
import Spinner from './Spinner';
import config from '../config';
import utils from '../utils/fetch';
import 'whatwg-fetch';
import auth from '../modules/Auth';


class Selling extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			count: 0,
			ready: false
		};
	}

	componentWillMount() {
		if(!auth.isUserAuthenticated()) this.props.history.replace('/');
	}

	componentDidMount() {
		this.loadData();
	}

	loadData() {
		this.setState({ ready: false });
		fetch(config.apiUrl + '/selling?limit=20', {
			headers: {
				'Content-Type':'application/json',
				Authorization: 'Bearer ' + auth.getToken()
			}
		})
			.then(utils.checkStatus)
			.then(utils.parseJSON)
			.then(data => {
				this.setState({
					ready: true,
					data: data.tickets,
					count: data.count
				});
			})
			.catch(err => console.log(err));
	}

	render() {
		return (
			<div className="uk-margin-top uk-margin-large-bottom">
				<h3 className="uk-animation-fade uk-animation-fast uk-heading-line"><span>Selling</span></h3>
				{!this.state.ready ?
					<Spinner />
					:
					<TicketsTable data={this.state.data} count={this.state.count} row={SellingRow} />
				}
			</div>
		);
	}
}

Selling.propTypes = {
	history: PropTypes.object.isRequired
};

export default Selling;
