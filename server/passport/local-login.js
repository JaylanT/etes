const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const Promise = require('bluebird');
const ibmdb = Promise.promisifyAll(require('ibm_db'));
const jwt = require('jsonwebtoken');
const dbConfig = require('../config/db-config');
const jwtConfig = require('../config/jwt-config');


function findUser(conn, email) {
	return conn.prepare('SELECT NAME, PASSWORD, EMAIL FROM USERS WHERE EMAIL = ?')
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
		session: false
	},
	(email, password, done) => {
		email = email.trim();
		
		ibmdb.open(dbConfig)
			.then(conn => {
				return findUser(conn, email)
					.then(data => {
						if (data.length === 0) {
							return done(null, false, { message: 'Incorrect email or password.' });
						}

						// user with email found, check password hash
						const foundUser = data[0];
						return comparePassword(foundUser, password)
							.then(match => {
								if (!match) {
									return done(null, false, { message: 'Incorrect email or password.' });
								}

								const payload = {
									sub: foundUser.EMAIL
								};
								const token = jwt.sign(payload, jwtConfig.secret);
								
								done(null, {
									name: foundUser.NAME,
									email: foundUser.EMAIL,
									token: token
								});
							});
					})
					.finally(() => conn.close());
			})
			.catch(err => done(err));
	}
);
