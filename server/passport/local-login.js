const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const Promise = require('bluebird');
const ibmdb = Promise.promisifyAll(require('ibm_db'));
const config = require('../config');


function findUser(conn, email) {
	return conn.prepare('SELECT NAME, PASSWORD FROM USERS WHERE EMAIL = ?')
		.then(stmt => {
			return new Promise((resolve, reject) => {
				stmt.execute([email], (err, result) => {
					if (err) {
						reject(Error(err));
					} else {
						const data = result.fetchAllSync();
						result.closeSync();
						resolve(data);
					}
					stmt.closeSync();
				});
			});
		});
}

function comparePassword(user, password) {
	return bcrypt.compare(password, user.PASSWORD);
}

module.exports = new LocalStrategy(
	{
		usernameField: 'email',
		passwordField: 'password',
		session: false,
		passReqToCallback: true

	},
	(req, email, password, done) => {
		email = email.trim();
		
		ibmdb.open(config)
			.then(conn => {
				return findUser(conn, email)
					.then(data => {
						if (data.length === 0) {
							return done(null, false, { message: 'Incorrect username or password.' });
						}

						// user with email found, check password hash
						const foundUser = data[0];
						return comparePassword(foundUser, password)
							.then(match => {
								if (!match) {
									return done(null, false, { message: 'Incorrect username or password.' });
								}
								
								done(null, foundUser.NAME);
							});
					})
					.finally(() => conn.close());
			})
			.catch(err => done(err));
	}
);
