import React from 'react';
import StateSelect from './StateSelect';

export default () => (
	<div className="uk-grid-small" data-uk-grid>
		<h4>Address</h4>
		<div className="uk-width-1-1">
			<input className="uk-input" type="text" placeholder="Full Name" name="name" required/>
		</div>
		<div className="uk-width-1-1">
			<input className="uk-input" type="text" placeholder="Address Line 1" name="addressLine1" required/>
		</div>
		<div className="uk-width-1-1">
			<input className="uk-input" type="text" placeholder="Address Line 2 (optional)" name="addressLine2" />
		</div>
		<div className="uk-width-1-2@m">
			<input className="uk-input" type="text" placeholder="City" name="city" required/>
		</div>
		<div className="uk-width-1-2@m">
			<StateSelect />
		</div>
		<div className="uk-width-1-1">
			<input className="uk-input" type="number" min="0" placeholder="Zip" name="zip" required/>
		</div>
	</div>
);
