import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './css/TicketsTable.css';


class TicketsTable extends Component {
	constructor(props) {
		super(props);
		this.renderRow = this.renderRow.bind(this);
	}

	getFormattedDate(date) {
		const d = new Date(date.split(' ')[0]);
		return d.toLocaleString('en-us', { year: 'numeric', month: 'long', day: 'numeric' });
	}

	renderRow(data) {
		return (
			<tr key={data.TICKET_ID}>
				<td className="uk-table-link">
					<Link className="uk-link-reset" to={`/tickets/${data.TICKET_ID}`}>
						<dl className="uk-description-list">
							<dt>{data.TITLE}</dt>
							<dd className="uk-visible@m">{data.DESCRIPTION}</dd>
						</dl>
					</Link>
				</td>
				<td className="uk-table-link uk-width-small">
					<Link className="uk-link-reset" to={`/tickets/${data.TICKET_ID}`}>
						${data.PRICE}
					</Link>
				</td>
				<td className="uk-table-link uk-width-small">
					<Link className="uk-link-reset" to={`/tickets/${data.TICKET_ID}`}>
						{data.CATEGORY}
					</Link>
				</td>
				<td className="uk-table-link uk-width-small">
					<Link className="uk-link-reset" to={`/tickets/${data.TICKET_ID}`}>
						{this.getFormattedDate(data.CREATED_AT)}
					</Link>
				</td>
			</tr>
		);
	}

	render() {
		return (
			<div id="tickets-table" className="uk-container">
				<h3 className="uk-animation-slide-left-small">{this.props.tableHeader}</h3>
				<table className="uk-table uk-table-middle uk-table-hover uk-animation-slide-left-small">
					<caption>{this.props.count} results</caption>
					<tbody>{this.props.data.map(this.renderRow)}</tbody>
				</table>
			</div>
		);
	}
}

export default TicketsTable;
