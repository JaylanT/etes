import React from 'react';
import TicketsRow from './TicketsRow';


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
				<td className="uk-width-small">{this.getFormattedDate(data.DATE_ORDERED)}</td>
				<td className="uk-width-small">{data.SHIP_TIME}</td>
			</tr>
		);
	}
}

export default OrderRow;
