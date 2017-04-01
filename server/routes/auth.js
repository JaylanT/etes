const router = require('express').Router();
const Promise = require('bluebird');
const ibmdb = Promise.promisifyAll(require('ibm_db'));
const passport = require('passport');


router.route('/register')
	.post((req, res, next) => {
		const data = req.body;
		const validation = validateSignupForm(data);

		if (!validation.success) {
			return res.status(400).json(validation);
		}
		passport.authenticate('local-signup', { session: false }, err => {
			if (err) {
				res.status(400).send(err.message);
			} else {
				res.send('success');
			}
		})(req, res, next);
	});

router.route('/login')
	.post((req, res, next) => {
		const data = req.body;
		const validation = validateLoginForm(data);

		if (!validation.success) {
			return res.status(400).json(validation);
		}
		passport.authenticate('local-login', { session: false }, (err, user, info) => {
			if (err) {
				res.status(400).send(err.message);
			} else if (!user) {
				res.status(422).send(info);
			} else {
				res.send(user);
			}
		})(req, res, next);
	});


function validateSignupForm(payload) {
	let isFormValid = true;
	const errors = {};
	
	if (!payload || typeof payload.email !== 'string' || !validateEmail(payload.email)) {
		isFormValid = false;
		errors.email = 'Invalid email.';
	}
	if (!payload || typeof payload.password !== 'string' || payload.password.length < 8) {
		isFormValid = false;
		errors.password = 'Password must be at least 8 characters long.';
	}
	if (!payload || typeof payload.name !== 'string' || payload.name.trim().legnth === 0) {
		isFormValid = false;
		errors.name = 'Please provide your name.';
	}

	const message = isFormValid ? '' : 'Form validation failed.';

	return {
		success: isFormValid,
		message,
		errors
	};
}

function validateLoginForm(payload) {
	let isFormValid = true;
	const errors = {};
	
	if (!payload || typeof payload.email !== 'string' || !validateEmail(payload.email)) {
		isFormValid = false;
		errors.email = 'Invalid email.';
	}
	if (!payload || typeof payload.password !== 'string' || payload.password.length < 8) {
		isFormValid = false;
		errors.password = 'Password must be at least 8 characters long.';
	}

	const message = isFormValid ? '' : 'Form validation failed.';

	return {
		success: isFormValid,
		message,
		errors
	};
}

function validateEmail(email) {
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
}

module.exports = router;
