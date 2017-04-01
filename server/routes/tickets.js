const router = require('express').Router();
const Promise = require('bluebird');
const ibmdb = Promise.promisifyAll(require('ibm_db'));
const config = require('../config/db-config');


router.route('/')
	.post((req, res, next) => {

	})
	.get((req, res, next) => {
		const limit = req.query.limit || 50,
				start = req.query.start || 0;

		ibmdb.open(config)
			.then(conn => {
				return conn.prepare('SELECT * FROM TICKETS ORDER BY DATE_CREATED LIMIT ? OFFSET ?')
					.then(stmt => {
						return new Promise((resolve, reject) => {
							stmt.execute([limit, start], (err, result) => {
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
					.then(data => res.send(data))
					.finally(() => conn.close());
			})
			.catch(err => res.status(400).send({
				status: 400,
				message: err.message
			}));
	});

module.exports = router;
