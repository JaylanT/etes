const router = require('express').Router();
const ibmdb = require('../modules/ibmdb');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt-config');
const Promise = require('bluebird');
const pagination = require('../modules/pagination');


router.route('/')
	.get((req, res, next) => {
		const page = parseInt(req.query.page) || 1,
			order = req.query.order,
			q = req.query.q;
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

		const selectOrders = 'SELECT O.TICKET_ID, O.ORDER_ID, O.DATE_ORDERED, O.SHIP_TIME, O.SHIP_DISTANCE, T.TITLE, T.DESCRIPTION, T.PRICE, T.CREATED_AT ' +
				'FROM ORDERS O INNER JOIN TICKETS T ON O.TICKET_ID = T.TICKET_ID ' +
				'WHERE BUYER_ID = ? ' +
				'ORDER BY DATE_ORDERED DESC LIMIT ? OFFSET ? ';
		const offset = (page - 1) * limit;
		const selectOrdersParams = [sellerId, limit, offset];

		const selectOrdersCount = 'SELECT COUNT(*) AS COUNT FROM ORDERS O ' +
			'WHERE BUYER_ID = ? ';
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

router.route('/:id')
	.get((req, res, next) => {
		const token = req.headers.authorization.split(' ')[1];
		let userId;
		try {
			const decoded = jwt.verify(token, jwtConfig.secret);
			userId = decoded.sub;
		} catch(err) {
			return res.status(401).end();
		}

		const orderId = req.params.id;
		const selectOrder = 'SELECT O.DATE_ORDERED, O.SHIP_TIME, O.SHIP_DISTANCE, T.TITLE, T.DESCRIPTION, T.PRICE, T.CREATED_AT, ' +
			'O.SHIP_NAME, O.SHIP_ADDRESS_LINE_1, O.SHIP_ADDRESS_LINE_2, O.SHIP_CITY, O.SHIP_STATE, O.SHIP_ZIP, ' +
			'T.SELLER_ADDRESS_LINE_1, T.SELLER_CITY, T.SELLER_STATE, T.SELLER_ZIP ' +
			'FROM ORDERS O INNER JOIN TICKETS T ON O.TICKET_ID = T.TICKET_ID ' +
			'WHERE BUYER_ID = ? AND ORDER_ID = ? ';

		ibmdb.open().then(conn => {
			return ibmdb.prepareAndExecute(conn, selectOrder, [userId, orderId])
				.catch(err => {
					conn.closeSync();
					throw Error(err.message);
				})
				.then(data => {
					conn.close();
					if (data.length === 0) {
						res.status(404).send({
							status: 404,
							message: 'Order not found.'
						});
					} else {
						res.send(data[0]);
					}
				});
		})
		.catch(err => res.status(400).send({
			status: 400,
			message: err.message || 'An unknown error has occurred.'
		}));
	});

module.exports = router;
