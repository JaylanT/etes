const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const Promise = require('bluebird');
const ibmdb = Promise.promisifyAll(require('ibm_db'));
const config = require('../config');


module.exports = new LocalStrategy (
	{
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true,
		session: false
	},
	(req, email, password, done) => {
		console.log('asdf')
		const userData = {
			email: email.trim(),
			password: password,
			name: req.body.name.trim()
		};

		ibmdb.open(config)
			.catch(err => done(err))
			.then(conn => { 
				return conn.prepare('INSERT INTO USERS (EMAIL, PASSWORD, NAME) VALUES (?, ?, ?)')
							.then(stmt => {
								return new Promise((resolve, reject) => {
									stmt.execute([userData.email, userData.password, userData.name], (err, result) => {
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
							.then(done(null))
							.finally(() => {
								conn.close();
							});
			})
			.catch(err => done(err));
	}
);
