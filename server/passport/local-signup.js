const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const Promise = require('bluebird');
const ibmdb = Promise.promisifyAll(require('ibm_db'));
const dbConfig = require('../config/db-config');


function createUser(conn, userData) {
	return conn.prepare('INSERT INTO USERS (EMAIL, PASSWORD, NAME) VALUES (?, ?, ?)')
		.then(stmt => {
			return hashPassword(userData.password)
					.then(hash => { 
						return new Promise((resolve, reject) => {
							stmt.executeNonQuery([userData.email, hash, userData.name], (err, ret) => {
								if (err) {
									reject(Error(err));
								} else {
									resolve(ret);
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

module.exports = new LocalStrategy(
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

		ibmdb.open(dbConfig)
			.then(conn => { 
				return createUser(conn, userData)
					.then(ret => done(null, ret))
					.finally(() => conn.close());
			})
			.catch(err => done(err));
	}
);
