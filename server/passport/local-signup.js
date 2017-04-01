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
		name = req.body.name.trim();

		hashPassword(password)
			.then(hash => {
				const sql = 'INSERT INTO USERS (EMAIL, PASSWORD, NAME) VALUES (?, ?, ?)';
				return ibmdb.executeNonQuery(sql, [email, hash, name]);
			})
			.then(ret => done(null, ret))
			.catch(err => done(err));
	}
);
