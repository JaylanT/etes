import React from 'react';
import dateFormat from 'dateformat';
import TicketsRow from './TicketsRow';


class SellingRow extends TicketsRow {
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
				<td className="uk-width-small">{data.CATEGORY}</td>
				<td className="uk-width-small">{dateFormat(date, 'mmm d, yyyy')}</td>
				<td className="uk-width-small">
					<small>Posted:</small><br/>
					{this.getFormattedDate(data.CREATED_AT)}
				</td>
			</tr>
		);
	}
}

export default SellingRow;
