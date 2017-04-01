const ibmdb = require('../modules/ibmdb');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt-config');

module.exports = (req, res, next) => {
	if (!req.headers.authorization) return res.status(401).end();

	const token = req.headers.authorization.split(' ')[1];

	return jwt.verify(token, jwtConfig.secret, (err, decoded) => {
		if (err) return res.status(401).end();

		const email = decoded.sub;
		const sql = 'SELECT * FROM USERS WHERE EMAIL = ?';

		ibmdb.execute(sql, [email])
			.then(data => {
				if (data.length === 0) {
					return res.status(401).end();
				}
				return next();
			})
			.catch(err => res.status(400).end({
				status: 400,
				message: err.message
			}));
	});
};
