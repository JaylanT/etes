const ibmdb = require('../modules/ibmdb');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt-config');

module.exports = (req, res, next) => {
	if (!req.headers.authorization) return res.status(401).end();

	const token = req.headers.authorization.split(' ')[1];

	return jwt.verify(token, jwtConfig.secret, (err, decoded) => {
		if (err) return res.status(401).end();

		const userId = decoded.sub;
		const sql = 'SELECT * FROM USERS WHERE USER_ID = ?';

		ibmdb.open().then(conn => {
			return ibmdb.prepareAndExecute(conn, sql, [userId])
				.catch(err => {
					conn.closeSync();
					throw Error(err.message);
				})
				.then(data => {
					conn.close();
					if (data.length === 0) {
						return res.status(401).end();
					}
					return next();
				});
		})
		.catch(err => {
			res.status(400).send({
				status: 400,
				message: err.message
			});
		});
	});
};
