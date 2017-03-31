const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const Promise = require('bluebird');
const ibmdb = Promise.promisifyAll(require('ibm_db'));
const config = require('../config');


function createUser(conn, userData) {
	return conn.prepare('INSERT INTO USERS (EMAIL, PASSWORD, NAME) VALUES (?, ?, ?)')
		.then(stmt => {
			return hashPassword(userData.password)
					.then(hash => { 
						return new Promise((resolve, reject) => {
							stmt.execute([userData.email, hash, userData.name], (err, result) => {
								if (err) {
									reject(Error(err));
								} else {
									result.closeSync();
									resolve(result);
								}
								stmt.closeSync();
						});
					});
			});
		});
}

function hashPassword(password) {
	const saltRounds = 10;
	return bcrypt.hash(password, saltRounds);
}

module.exports = new LocalStrategy (
	{
		usernameField: 'email',
		passwordField: 'password',
		session: false,
		passReqToCallback: true

	},
	(req, email, password, done) => {
		const userData = {
			email: email.trim(),
			password: password,
			name: req.body.name.trim()
		};

		ibmdb.open(config)
			.then(conn => { 
				return createUser(conn, userData)
					.then(() => done(null))
					.finally(() => conn.close());
			})
			.catch(err => done(err));
	}
);
