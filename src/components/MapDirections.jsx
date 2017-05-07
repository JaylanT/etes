/* global google */
import { default as React, Component } from 'react';
import PropTypes from 'prop-types';
import { withGoogleMap, GoogleMap, DirectionsRenderer } from 'react-google-maps';

const DirectionsExampleGoogleMap = withGoogleMap(props => (
	<GoogleMap
		defaultZoom={7}
		defaultCenter={props.center}
	>
		{props.directions && <DirectionsRenderer directions={props.directions} />}
	</GoogleMap>
));

class DirectionsExample extends Component {
	constructor(props) {
		super(props);
		this.state = {
			origin: props.origin,
			destination: props.destination,
			directions: null,
		};
	}

	componentDidMount() {
		const DirectionsService = new google.maps.DirectionsService();

		DirectionsService.route({
			origin: this.state.origin,
			destination: this.state.destination,
			travelMode: google.maps.TravelMode.DRIVING,
		}, (result, status) => {
			if (status === google.maps.DirectionsStatus.OK) {
				this.setState({
					directions: result,
				});
			} else {
				console.error(`error fetching directions ${result}`);
			}
		});
	}

	render() {
		return (
			<DirectionsExampleGoogleMap
				containerElement={
					<div style={{ height: `500px` }} />
				}
				mapElement={
					<div style={{ height: `500px` }} />
				}
				center={this.state.origin}
				directions={this.state.directions}
			/>
		);
	}
}

DirectionsExample.propTypes = {
	origin: PropTypes.string.isRequired,
	destination: PropTypes.string.isRequired
};

export default DirectionsExample;
