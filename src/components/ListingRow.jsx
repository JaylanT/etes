import React from 'react';
import TicketsRow from './TicketsRow';
import { Link } from 'react-router-dom';
import Auth from '../modules/Auth';


class ListingRow extends TicketsRow {
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
				<td className="uk-width-small">{this.getFormattedDate(data.CREATED_AT)}</td>
				<td className="uk-width-small">
					{Auth.isUserAuthenticated() && data.SELLER_ID !== this.getUserId() &&
						<Link to={`/tickets/${data.TICKET_ID}/purchase`} className="uk-button uk-button-default">Buy</Link>
					}
				</td>
			</tr>
		);
	}
}

export default ListingRow;
