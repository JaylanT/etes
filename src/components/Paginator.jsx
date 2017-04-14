import React, { Component } from 'react'
import { Link } from 'react-router-dom';


class Paginator extends Component {
	prevPageLinkClass() {
		return !this.props.prevPage ? 'uk-hidden' : '';
	}

	nextPageLinkClass() {
		let link = 'uk-margin-auto-left';
		if (!this.props.nextPage) link += ' uk-hidden';
		return link;
	}

	render() {
		return (
			<div className="uk-animation-fade uk-animation-fast">
				<ul className="uk-pagination">
					 <li className={this.prevPageLinkClass()}><Link to={this.props.prevPage}><span className="uk-margin-small-right" data-uk-icon="icon: pagination-previous"></span> Previous</Link></li>
					 <li className={this.nextPageLinkClass()}><Link to={this.props.nextPage}>Next <span className="uk-margin-small-left" data-uk-icon="icon : pagination-next"></span></Link></li>
				</ul>
			</div>
		);
	}
}

export default Paginator;
