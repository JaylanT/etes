import React, { Component } from 'react';
import PropTypes from 'prop-types';


class TicketsTable extends Component {
	constructor(props) {
		super(props);
		this.renderRow = this.renderRow.bind(this);
	}

	renderRow(data) {
		const Row = this.props.row;
		return <Row data={data} key={data.TICKET_ID} />;
	}

	render() {
		return (
			<table className="uk-table uk-table-divider uk-table-middle uk-table-hover uk-margin-bottom uk-animation-slide-left-small">
				<caption>{this.props.count} results</caption>
				<tbody>{this.props.data.map(this.renderRow)}</tbody>
			</table>
		);
	}
}

TicketsTable.propTypes = {
	row: PropTypes.func.isRequired,
	count: PropTypes.number.isRequired,
	data: PropTypes.arrayOf(
		PropTypes.shape({
			"TICKET_ID": PropTypes.number,
			"SELLER_ID": PropTypes.number,
			"CATEGORY_ID": PropTypes.number,
			"TITLE": PropTypes.string,
			"DESCRIPTION": PropTypes.string,
			"PRICE": PropTypes.string,
			"CREATED_AT": PropTypes.string,
			"SOLD": PropTypes.number,
			"CATEGORY": PropTypes.string
		})
	).isRequired
};

export default TicketsTable;
