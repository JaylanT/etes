import React, { Component } from 'react';
import PropTypes from 'prop-types';


class OrderRow extends Component {
	getFormattedDate(date) {
		const d = new Date(date.split(' ')[0]);
		return d.toLocaleString('en-us', { year: 'numeric', month: 'long', day: 'numeric' });
	}

	render() {
		const data = this.props.data;
		return (
			<tr key={data.TICKET_ID}>
				<td>
					<dl className="uk-description-list">
						<dt>{data.TITLE}</dt>
						<dd className="uk-visible@m">{data.DESCRIPTION}</dd>
					</dl>
				</td>
				<td className="uk-width-small">${data.PRICE}</td>
				<td className="uk-width-small">{this.getFormattedDate(data.DATE_ORDERED)}</td>
				<td className="uk-width-small">{data.SHIP_TIME}</td>
			</tr>
		);
	}
}

OrderRow.propTypes = {
	data: PropTypes.object
};

export default OrderRow;
