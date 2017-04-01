const router = require('express').Router();
const Promise = require('bluebird');
const ibmdb = Promise.promisifyAll(require('ibm_db'));
const config = require('../config/db-config');


router.route('/')
	.post((req, res, next) => {

	})
	.get((req, res, next) => {
		const limit = req.query.limit || 50,
				start = req.query.start || 0,
				orderBy = req.query.orderBy;

		// limit max of 50
		if (limit > 50) limit = 50;

		const orderByIdentifier = getOrderByIdentifier(orderBy);

		ibmdb.open(config)
			.then(conn => {
				const sql = 'SELECT T.*, U.NAME AS SELLER FROM TICKETS T, USERS U ' +
								'WHERE T.SELLER_ID = U.USER_ID ' +
								'ORDER BY ' + orderByIdentifier + ' LIMIT ? OFFSET ?'
				return conn.prepare(sql)
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

router.route('/:id')
	.get((req, res, next) => {
		const ticketId = req.params.id;

		ibmdb.open(config)
			.then(conn => {
				const sql = 'SELECT T.*, U.NAME AS SELLER FROM TICKETS T, USERS U ' +
								'WHERE T.TICKET_ID = ? ' +
								'AND T.SELLER_ID = U.USER_ID';
				return conn.prepare(sql)
					.then(stmt => {
						return new Promise((resolve, reject) => {
							stmt.execute([ticketId], (err, result) => {
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

function getOrderByIdentifier(orderBy) {
	let identifier = '';

	switch(orderBy) {
		case 'newest':
			identifier = 'CREATED_AT DESC';
			break;
		case 'oldest':
			identifier = 'CREATED_AT';
			break;
		case 'price_highest':
			identifier = 'PRICE DESC';
			break;
		case 'price_lowest':
			identifier = 'PRICE';
			break;
		default:
			identifier = 'CREATED_AT DESC';
			break;
	}
	return identifier;
}

module.exports = router;
