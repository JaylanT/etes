const router = require('express').Router();
const passport = require('passport');


router.route('/register')
	.post((req, res, next) => {
		const data = req.body;
		const validation = validateSignupForm(data);

		if (!validation.success) {
			delete validation.success;
			return res.status(400).json(validation);
		}
		passport.authenticate('local-signup', (err, ret) => {
			if (err) {
				const errorCode = err.message.split(' ')[3];
				let status = 400;
				let message = '';
				if (errorCode === 'SQL0803N') {
					status = 409;
					message = 'An account with that email already exists.';
				} else {
					message = err.message;
				}
				res.status(status).send({
					status,
					message
				});
			} else if (ret !== 1) {
				res.status(400).send({
					status: 400,
					message: 'Registration failed.'
				});
			} else {
				// login after successful registration
				passport.authenticate('local-login', (err, user, info) => handleLogin(err, user, info, res))(req, res, next);
			}
		})(req, res, next);
	});

router.route('/login')
	.post((req, res, next) => {
		const data = req.body;
		const validation = validateLoginForm(data);

		if (!validation.success) {
			delete validation.success;
			return res.status(400).json(validation);
		}
		passport.authenticate('local-login', (err, user, info) => handleLogin(err, user, info, res))(req, res, next);
	});

function handleLogin(err, user, info, res) {
	if (err) {
		res.status(400).send({
			status: 400,
			message: err.message
		});
	} else if (!user) {
		res.status(422).send({
			status: 422,
			message: info.message
		});
	} else {
		res.send(user);
	}
}


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
