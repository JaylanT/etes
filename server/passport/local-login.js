const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const ibmdb = require('../modules/ibmdb');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt-config');


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
		const sql = 'SELECT * FROM USERS WHERE EMAIL = ?';

		ibmdb.open().then(conn => {
			return ibmdb.prepareAndExecute(conn, sql, [email])
				.then(data => {
					conn.close();
					if (data.length === 0) {
						return done(null, false, { message: 'Incorrect email or password.' });
					}

					// user with email found, check password hash
					const foundUser = data[0];
					return comparePassword(foundUser, password).then(match => {
						if (!match) {
							return done(null, false, { message: 'Incorrect email or password.' });
						}

						const payload = {
							sub: foundUser.USER_ID,
							username: foundUser.USERNAME
						};
						const token = jwt.sign(payload, jwtConfig.secret);

						done(null, {
							token: token
						});
					});
				});
		})
		.catch(err => done(err));
	}
);
