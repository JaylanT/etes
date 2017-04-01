const Promise = require('bluebird');
const ibmdb = Promise.promisifyAll(require('ibm_db'));
const dbConfig = require('../config/db-config');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt-config');

module.exports = (req, res, next) => {
	if (!req.headers.authorization) return res.status(401).end();

	const token = req.headers.authorization.split(' ')[1];

	return jwt.verify(token, jwtConfig.secret, (err, decoded) => {
		if (err) return res.status(401).end();

		const email = decoded.sub;

		ibmdb.open(dbConfig)
			.then(conn => {
				return conn.prepare('SELECT * FROM USERS WHERE EMAIL = ?')
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
					})
					.then(data => {
						if (data.length === 0) {
							return res.status(401).end();
						}
						return next();
					})
					.finally(() => conn.close())
			})
			.catch(err => res.status(400).send(err));
	});
};
