const router = require('express').Router();
const ibmdb = require('../modules/ibmdb');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt-config');
const pagination = require('../modules/pagination');


router.route('/')
	.get((req, res, next) => {
		const page = parseInt(req.query.page) || 1,
			order = req.query.order,
			q = req.query.q,
			category = req.query.category;
		let limit = parseInt(req.query.limit) || 30;

		// limit max of 100
		if (limit > 100) limit = 100;

		const token = req.headers.authorization.split(' ')[1];
		let sellerId;
		try {
			const decoded = jwt.verify(token, jwtConfig.secret);
			sellerId = decoded.sub;
		} catch(err) {
			return res.status(401).end();
		}

		const selectOrders = 'SELECT O.TICKET_ID, O.DATE_ORDERED, T.TITLE, T.DESCRIPTION, T.PRICE, T.CREATED_AT ' +
				'FROM ORDERS O INNER JOIN TICKETS T ON O.TICKET_ID = T.TICKET_ID ' +
				'WHERE BUYER_ID = ? ' +
				'ORDER BY DATE_ORDERED DESC LIMIT ? OFFSET ? ';
		const offset = (page - 1) * limit;
		const selectOrdersParams = [sellerId, limit, offset];

		const selectOrdersCount = 'SELECT COUNT(*) AS COUNT FROM ORDERS O ' +
			'WHERE BUYER_ID = ? '
		const selectOrdersCountParams = [sellerId];

		ibmdb.open().then(conn => {
			const ticketsQuery = ibmdb.prepareAndExecute(conn, selectOrders, selectOrdersParams);
			const countQuery = ibmdb.prepareAndExecute(conn, selectOrdersCount, selectOrdersCountParams);

			return Promise.all([ticketsQuery, countQuery]).then(values => {
				conn.close();

				const tickets = values[0],
					count = values[1][0].COUNT;

				const links = pagination('orders', count, limit, page, q, order);
				res.links(links);

				res.send({
					tickets,
					count
				});
			})
			.catch(err => {
				conn.closeSync();
				throw Error(err.message);
			});
		})
		.catch(err => {
			res.status(400).send({
				status: 400,
				message: err.message || 'An unknown erorr has occurred.'
			});
		});
	});

module.exports = router;
