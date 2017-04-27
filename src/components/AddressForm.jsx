import React from 'react';
import PropTypes from 'prop-types';
import StateSelect from './StateSelect';


class AddressForm extends React.Component {
	render() {
		return (
			<div className="uk-grid-small uk-form-stacked" data-uk-grid>
				<div className="uk-width-1-1">
					<label className="uk-form-label" htmlFor="name-input">Full Name</label>
					<input id="name-input" className="uk-input" type="text" name="name" defaultValue={this.props.name} required/>
				</div>
				<div className="uk-width-1-1">
					<label className="uk-form-label" htmlFor="address-line-1-input">Address</label>
					<input id="address-line-1-input" className="uk-input" type="text" name="addressLine1" defaultValue={this.props.addressLine1} required/>
				</div>
				<div className="uk-width-1-1">
					<input className="uk-input" type="text" placeholder="Apt, Suite, Bldg. (optional)" name="addressLine2" defaultValue={this.props.addressLine2}/>
				</div>
				<div className="uk-width-1-2@m">
					<label className="uk-form-label" htmlFor="city-input">City</label>
					<input id="city-input" className="uk-input" type="text" name="city" defaultValue={this.props.city} required/>
				</div>
				<div className="uk-width-1-2@m">
					<label className="uk-form-label">State</label>
					<StateSelect selected={this.props.state} />
				</div>
				<div className="uk-width-1-1">
					<label className="uk-form-label" htmlFor="zip-input">Zip Code</label>
					<input id="zip-input" className="uk-input" type="text" pattern="(\d{5}([\-]\d{4})?)" name="zip" defaultValue={this.props.zip} required/>
				</div>
			</div>
		);
	}
}

AddressForm.propTypes = {
	name: PropTypes.string,
	addressLine1: PropTypes.string,
	addressLine2: PropTypes.string,
	city: PropTypes.string,
	state: PropTypes.string,
	zip: PropTypes.string
};

export default AddressForm;
