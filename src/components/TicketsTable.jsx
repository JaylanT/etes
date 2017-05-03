import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Auth from '../modules/Auth';
import { Link } from 'react-router-dom';


class TicketsTable extends Component {
	constructor(props) {
		super(props);
		this.renderRow = this.renderRow.bind(this);
	}

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

	renderRow(data) {
		return (
			<tr key={data.TICKET_ID}>
				<td>
					<dl className="uk-description-list">
						<dt>{data.TITLE}</dt>
						<dd className="uk-visible@m">{data.DESCRIPTION}</dd>
					</dl>
				</td>
				<td className="uk-width-small">${data.PRICE}</td>
				<td className="uk-width-small">{this.getFormattedDate(data.CREATED_AT)}</td>
				<td className="uk-width-small">
					{Auth.isUserAuthenticated() && data.SELLER_ID !== this.getUserId() &&
						<Link to={`/tickets/${data.TICKET_ID}/purchase`} className="uk-button uk-button-default">Buy</Link>
					}
					{Auth.isUserAuthenticated() && data.SELLER_ID === this.getUserId() && data.SOLD === 1 &&
						<b>SOLD</b>
					}
				</td>
			</tr>
		);
	}

	render() {
		return (
			<table className="uk-table uk-table-divider uk-table-middle uk-table-hover uk-margin-bottom uk-animation-slide-left-small">
				<caption>{this.props.count} results</caption>
				<tbody>{this.props.data.map(this.renderRow)}</tbody>
			</table>
		);
	}
}

TicketsTable.propTypes = {
	count: PropTypes.number.isRequired,
	data: PropTypes.arrayOf(
		PropTypes.shape({
			"TICKET_ID": PropTypes.number,
			"SELLER_ID": PropTypes.number,
			"CATEGORY_ID": PropTypes.number,
			"TITLE": PropTypes.string,
			"DESCRIPTION": PropTypes.string,
			"PRICE": PropTypes.string,
			"CREATED_AT": PropTypes.string,
			"SOLD": PropTypes.number,
			"CATEGORY": PropTypes.string
		})
	).isRequired
};

export default TicketsTable;
