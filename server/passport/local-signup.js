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

		hashPassword(password).then(hash => {
			const sql = 'INSERT INTO USERS (EMAIL, PASSWORD, USERNAME) VALUES (?, ?, ?)';
			const params = [email, hash, username];

			return ibmdb.open().then(conn => {
				return ibmdb.prepareAndExecuteNonQuery(conn, sql, params)
					.catch(err => {
						conn.closeSync();
						throw Error(err.message);
					})
					.then(ret => {
						conn.close();
						done(null, ret);
					});
			});
		})
		.catch(err => done(err));
	}
);
