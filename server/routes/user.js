const router = require('express').Router();
const Promise = require('bluebird');
const ibmdb = Promise.promisifyAll(require('ibm_db'));
const config = require('../config');
const passport = require('passport');


router.route('/signup')
	.post((req, res, next) => {
		const data = req.body;
		const validation = validateSignupForm(data);

		if (!validation.success) {
			return res.status(400).json(validation);
		}
		//passport.authenticate('local-signup', { session: false }, err => {
		//	if (err) {
		//		console.log(err);
		//		res.status(400).send('failed');
		//	} else {
		//		res.send('success');
		//	}
		//});

		ibmdb.open(config)
			.catch(err => res.status(500).send(err.message))
			.then(conn => { 
				return conn.prepare('INSERT INTO USERS (EMAIL, PASSWORD, NAME) VALUES (?, ?, ?)')
							.then(stmt => {
								const email = data.email,
									  password = data.password,
									  name = data.name.trim();

								return new Promise((resolve, reject) => {
									stmt.execute([email, password, name], (err, result) => {
										if (err) {
											reject(Error(err));
										} else {
											result.closeSync();
											resolve(result);
										}
										stmt.closeSync();
									});
								});
							})
							.then(result => res.send(result))
							.finally(() => {
								conn.close();
							});
			})
			.catch(err => res.status(400).send(err.message));
	});

router.route('/login')
	.post((req, res, next) => {
		console.log(req.body);
		ibmdb.open(config)
			.catch(err => res.status(500).send(err.message))
			.then(conn => {
				return conn.query('select email, name from users')
							.then(rows => {
								conn.close();
								res.send(rows);
							});
			})
			.catch(err => res.status(400).send(err.message));
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

function validateEmail(email) {
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
}

module.exports = router;
