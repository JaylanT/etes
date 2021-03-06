import React from 'react';
import dateFormat from 'dateformat';
import TicketsRow from './TicketsRow';
import { Link } from 'react-router-dom';
import Auth from '../modules/Auth';


class ListingRow extends TicketsRow {
	render() {
		const data = this.props.data;
		const dt = new Date();
		const date = new Date((parseInt(data.DATE, 10) + dt.getTimezoneOffset() * 60) * 1000);
		return (
			<tr>
				<td>
					<dl className="uk-description-list">
						<dt>{data.TITLE}</dt>
						<dd className="uk-visible@m">{data.DESCRIPTION}</dd>
					</dl>
				</td>
				<td className="uk-width-small">${data.PRICE}</td>
				<td className="uk-width-small">{dateFormat(date, 'mmm d, yyyy')}</td>
				<td className="uk-width-small uk-text-center">
					{Auth.isUserAuthenticated() && data.SELLER_ID === this.getUserId() ? 
						<span data-uk-icon="icon: user"></span>
						:
						<Link to={`/tickets/${data.TICKET_ID}/purchase`} className="uk-button uk-button-default">Buy</Link>
					}
				</td>
			</tr>
		);
	}
}

export default ListingRow;
