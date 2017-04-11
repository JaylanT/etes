import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './css/TicketsTable.css';


class TicketsTable extends Component {
	renderRow(data) {
		return (
			<tr key={data.TICKET_ID}>
				<td className="uk-table-link">
					<Link className="uk-link-reset" to={`/tickets/${data.TICKET_ID}`}>
						<dl className="uk-description-list">
							<dd>{data.TITLE}</dd>
							<dt>{data.DESCRIPTION}</dt>
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
						{data.CREATED_AT}
					</Link>
				</td>
			</tr>
		);
	}

	render() {
		return (
			<div id="tickets-table" className="uk-container">
				<h2 className="uk-animation-slide-left-small">{this.props.tableHeader}</h2>
				<table className="uk-table uk-table-middle uk-table-hover uk-animation-slide-left-small">
					<caption>{this.props.count} results</caption>
					<tbody>{this.props.data.map(this.renderRow)}</tbody>
				</table>
			</div>
		);
	}
}

export default TicketsTable;
