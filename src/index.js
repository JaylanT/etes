import React from 'react';
import ReactDOM from 'react-dom';
import Base from './components/Base';
import './index.css';
import { BrowserRouter as Router } from 'react-router-dom';


ReactDOM.render((
	<Router>
		<Base />
	</Router>
), document.getElementById('root'));

