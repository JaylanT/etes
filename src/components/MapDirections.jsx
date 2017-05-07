/* global google */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withGoogleMap, GoogleMap, DirectionsRenderer } from 'react-google-maps';


const DirectionsGoogleMap = withGoogleMap(props => (
	<GoogleMap defaultZoom={7}>
		{props.directions &&
			<DirectionsRenderer directions={props.directions} />
		}
	</GoogleMap>
));

class MapDirections extends Component {
	constructor(props) {
		super(props);
		this.state = {
			directions: null
		};
	}

	componentDidMount() {
		const DirectionsService = new google.maps.DirectionsService();

		DirectionsService.route({
			origin: this.props.origin,
			destination: this.props.destination,
			travelMode: google.maps.TravelMode.DRIVING,
		}, (result, status) => {
			if (status === google.maps.DirectionsStatus.OK) {
				this.setState({
					directions: result,
				});
			} else {
				console.error(`Error fetching directions ${result}`);
			}
		});
	}

	render() {
		return (
			<DirectionsGoogleMap
				containerElement={
					<div style={{ height: `450px` }} />
				}
				mapElement={
					<div style={{ height: `450px` }} />
				}
				directions={this.state.directions}
			/>
		);
	}
}

MapDirections.propTypes = {
	origin: PropTypes.string.isRequired,
	destination: PropTypes.string.isRequired
};

export default MapDirections;
