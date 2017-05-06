import React from 'react';
import TicketsRow from './TicketsRow';
import Auth from '../modules/Auth';


class SellingRow extends TicketsRow {
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
				<td className="uk-width-small">{this.getFormattedDate(data.CREATED_AT)}</td>
				<td className="uk-width-small">
					{Auth.isUserAuthenticated() && data.SELLER_ID === this.getUserId() && data.SOLD === 1 &&
						<b>SOLD</b>
					}
				</td>
			</tr>
		);
	}
}

export default SellingRow;
