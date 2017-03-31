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
	let isFormValid = payload ? true : false;
	let error = '';
	
	if (isFormValid) {
		if (typeof payload.email !== 'string' || !validateEmail(payload.email)) {
			isFormValid = false;
			error = 'Invalid email.';
		} else if (typeof payload.password !== 'string' || payload.password.length < 8) {
			isFormValid = false;
			error = 'Password must be at least 8 characters long.';
		} else if (typeof payload.name !== 'string' || payload.name.trim().legnth === 0) {
			isFormValid = false;
			error = 'Please provide your name.';
		}
	}

	return {
		success: isFormValid,
		error
	};
}

function validateLoginForm(payload) {
	let isFormValid = payload ? true : false;
	let error = '';
	
	if (isFormValid) {
		if (typeof payload.email !== 'string' || !validateEmail(payload.email)) {
			isFormValid = false;
			error = 'Invalid email.';
		} else if (typeof payload.password !== 'string' || payload.password.length < 8) {
			isFormValid = false;
			error = 'Password must be at least 8 characters long.';
		}
	}

	return {
		success: isFormValid,
		error
	};
}

function validateEmail(email) {
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
}

module.exports = router;
