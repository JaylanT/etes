import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Spinner from './Spinner';
import config from '../config';
import utils from '../utils/fetch';
import 'whatwg-fetch';
import './css/Home.css';


class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			ready: false
		}
	}

	componentDidMount() {
		this.loadData();
	}
	
	loadData() {
		this.setState({ ready: false });
		fetch(config.apiUrl + '/tickets')
			.then(utils.checkStatus)
			.then(utils.parseJSON)
			.then(data => {
				console.log(data);
				this.setState({ 
					ready: true,
					data: data.tickets || [],
					count: data.count
				});
			})
			.catch(err => console.log(err));
	}

	render() {
		return (
			<div>
				{!this.state.ready ?
					<Spinner/>
				:
					<div id="tickets-table" className="uk-container">
						<h2 className="uk-animation-slide-left-small">Newest Listings</h2>
						<table className="uk-table uk-table-middle uk-table-hover uk-animation-slide-left-small">
							<caption>{this.state.count} results</caption>
							<tbody>
								{this.state.data.map(data =>
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
								)}
							</tbody>
						</table>
					</div>
				}
			</div>
		);
	}
}

export default Home;
