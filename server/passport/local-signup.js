const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const ibmdb = require('../modules/ibmdb');


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
		email = email.trim();
		const username = req.body.username.trim();

		hashPassword(password)
			.then(hash => {
				const sql = 'INSERT INTO USERS (EMAIL, PASSWORD, USERNAME) VALUES (?, ?, ?)';
				return ibmdb.executeNonQuery(sql, [email, hash, username]);
			})
			.then(ret => done(null, ret))
			.catch(err => done(err));
	}
);
