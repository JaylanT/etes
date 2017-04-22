import React from 'react';
import StateSelect from './StateSelect';

export default () => (
	<div className="uk-grid-small uk-form-stacked" data-uk-grid>
		<h4>Address</h4>
		<div className="uk-width-1-1">
			<label className="uk-form-label" htmlFor="name-input">Full Name</label>
			<input id="name-input" className="uk-input" type="text" name="name" required/>
		</div>
		<div className="uk-width-1-1">
			<label className="uk-form-label" htmlFor="address-line-1-input">Address</label>
			<input id="address-line-1-input" className="uk-input" type="text" name="addressLine1" required/>
		</div>
		<div className="uk-width-1-1">
			<input className="uk-input" type="text" placeholder="Apt, Suite, Bldg. (optional)" name="addressLine2" />
		</div>
		<div className="uk-width-1-2@m">
			<label className="uk-form-label" htmlFor="city-input">City</label>
			<input id="city-input" className="uk-input" type="text" name="city" required/>
		</div>
		<div className="uk-width-1-2@m">
			<label className="uk-form-label">State</label>
			<StateSelect />
		</div>
		<div className="uk-width-1-1">
			<label className="uk-form-label" htmlFor="zip-input">Zip Code</label>
			<input id="zip-input" className="uk-input" type="text" pattern="[0-9]{5}" name="zip" required/>
		</div>
	</div>
);
