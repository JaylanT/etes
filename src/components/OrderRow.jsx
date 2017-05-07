import React from 'react';
import TicketsRow from './TicketsRow';
import { Link } from 'react-router-dom';


class OrderRow extends TicketsRow {
	render() {
		const data = this.props.data;
		return (
			<tr>
				<td>
					<dl className="uk-description-list">
						<dt>{data.TITLE}</dt>
						<dd className="uk-visible@m">{data.DESCRIPTION}</dd>
					</dl>
				</td>
				<td className="uk-width-small">${data.PRICE}</td>
				<td className="uk-width-small">
					<small>Order Date:</small><br/>
					{this.getFormattedDate(data.DATE_ORDERED)}
				</td>
				<td className="uk-width-small">
					<small>ETA:</small><br/>
					{data.SHIP_TIME}
				</td>
				<td className="uk-width-small">
					<Link to={`/orders/${data.ORDER_ID}`} className="uk-button uk-button-default">Details</Link>
				</td>
			</tr>
		);
	}
}

export default OrderRow;
