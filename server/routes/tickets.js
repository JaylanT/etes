const router = require('express').Router();
const Promise = require('bluebird');
const ibmdb = require('../modules/ibmdb');
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

		const date = new Date();
		date.setHours(0, 0, 0, 0);
		const now = parseInt(date.getTime() / 1000, 10);

		let selectTickets = 'SELECT T.TICKET_ID, T.TITLE, T.DESCRIPTION, T.PRICE, T.DATE, C.NAME AS CATEGORY, T.SELLER_ID ' +
				'FROM TICKETS T INNER JOIN CATEGORIES C ON T.CATEGORY_ID = C.CATEGORY_ID ' +
				'WHERE T.SOLD = 0 AND T.DATE >= ? ';
		const selectTicketsParams = [now];

		let selectTicketsCount = 'SELECT COUNT(*) AS COUNT FROM TICKETS T ' +
			'INNER JOIN CATEGORIES C ON T.CATEGORY_ID = C.CATEGORY_ID ' +
			'WHERE T.SOLD = 0 AND T.DATE >= ? ';
		const selectTicketsCountParams = [now];

		if (q) {
			const containsClause = 'AND (CONTAINS(T.TITLE, ?) = 1 OR CONTAINS(T.DESCRIPTION, ?) = 1) ';
			selectTickets += containsClause;
			selectTicketsCount += containsClause;
			selectTicketsParams.push(q, q);
			selectTicketsCountParams.push(q, q);
		} 

		if (category) {
			selectTickets += 'AND C.NAME = ? ';
			selectTicketsCount += 'AND C.NAME = ? ';
			selectTicketsParams.push(category);
			selectTicketsCountParams.push(category);
		}

		const offset = (page - 1) * limit;
		selectTicketsParams.push(limit, offset);
		const orderIdentifier = getOrderIdentifier(order);
		selectTickets += 'ORDER BY ' + orderIdentifier + ' LIMIT ? OFFSET ?';

		ibmdb.open().then(conn => {
			const ticketsQuery = ibmdb.prepareAndExecute(conn, selectTickets, selectTicketsParams);
			const countQuery = ibmdb.prepareAndExecute(conn, selectTicketsCount, selectTicketsCountParams);

			return Promise.all([ticketsQuery, countQuery]).then(values => {
				conn.close();

				const tickets = values[0],
					count = values[1][0].COUNT;

				const links = pagination('tickets', count, limit, page, q, order);
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
		const ticketId = req.params.id;

		const sql = 'SELECT T.TICKET_ID, T.TITLE, T.DESCRIPTION, T.PRICE, T.CREATED_AT, C.NAME AS CATEGORY ' +
			'FROM TICKETS T INNER JOIN CATEGORIES C ON T.CATEGORY_ID = C.CATEGORY_ID ' +
			'WHERE T.TICKET_ID = ?'; 

		ibmdb.open().then(conn => {
			return ibmdb.prepareAndExecute(conn, sql, [ticketId])
				.catch(err => {
					conn.closeSync();
					throw Error(err.message);
				})
				.then(data => {
					conn.close();
					if (data.length === 0) {
						res.status(404).send({
							status: 404,
							message: 'Ticket not found.'
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

function getOrderIdentifier(order) {
	let identifier = '';

	switch(order) {
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
	}
	return identifier;
}

module.exports = router;
