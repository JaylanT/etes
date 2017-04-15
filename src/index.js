import React from 'react';
import ReactDOM from 'react-dom';
import Base from './components/Base';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';


ReactDOM.render((
	<Router>
		<Base />
	</Router>
), document.getElementById('root'));

