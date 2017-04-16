import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';


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
			<table className="uk-table uk-table-middle uk-table-hover uk-margin-bottom uk-animation-slide-left-small">
				<caption>{this.props.count} results</caption>
				<tbody>{this.props.data.map(this.renderRow)}</tbody>
			</table>
		);
	}
}

TicketsTable.propTypes = {
	count: PropTypes.number.isRequired,
	data: PropTypes.arrayOf(PropTypes.shape({
		"TICKET_ID": PropTypes.number,
		"SELLER_ID": PropTypes.number,
		"CATEGORY_ID": PropTypes.number,
		"TITLE": PropTypes.string,
		"DESCRIPTION": PropTypes.string,
		"PRICE": PropTypes.string,
		"CREATED_AT": PropTypes.string,
		"SOLD": PropTypes.number,
		"CATEGORY": PropTypes.string
	})).isRequired
};

export default TicketsTable;
