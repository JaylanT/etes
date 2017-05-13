import React from 'react';
import TicketsRow from './TicketsRow';
import { Link } from 'react-router-dom';
import dateFormat from 'dateformat';


class OrderRow extends TicketsRow {
	render() {
		const data = this.props.data;
		const eta = new Date(parseInt(data.DELIVERY_ETA, 10) * 1000);
		return (
			<tr>
				<td className="uk-width-medium">
					<dl className="uk-description-list">
						<dt>{data.TITLE}</dt>
					</dl>
				</td>
				<td className="uk-width-small">${data.TOTAL_PRICE}</td>
				<td className="uk-width-small">
					<small>Ordered:</small><br/> 
					{super.getFormattedDate(data.DATE_ORDERED)}
				</td>
				<td className="uk-width-small">
					<small>ETA:</small><br/>
					{dateFormat(eta, 'mmm d, h:MM TT')}
				</td>
				<td className="uk-width-small">
					<Link to={`/orders/${data.ORDER_ID}`} className="uk-button uk-button-default">Details</Link>
				</td>
			</tr>
		);
	}
}

export default OrderRow;
