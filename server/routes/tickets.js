const router = require('express').Router();
const ibmdb = require('../modules/ibmdb');


router.route('/')
	.get((req, res, next) => {
		const limit = req.query.limit || 50,
				page = req.query.page || 1,
				order = req.query.order,
				q = req.query.q;

		// limit max of 50
		if (limit > 50) limit = 50;
		
		const offset = (page - 1) * limit;
		const params = [];

		let sql = 'SELECT T.*, U.NAME AS SELLER FROM TICKETS T, USERS U ' +
					 'WHERE T.SELLER_ID = U.USER_ID '
		if (q) {
			sql += 'AND (CONTAINS(T.TITLE, ?) = 1 OR CONTAINS(T.DESCRIPTION, ?) = 1) ';
			params.push(q, q);
		} 

		params.push(limit, offset);

		const orderIdentifier = getOrderIdentifier(order);
		sql += 'ORDER BY ' + orderIdentifier + ' LIMIT ? OFFSET ?';

		ibmdb.execute(sql, params)
			.then(data => {
				if (data.length === 0) {
					res.send('No tickets available.');
				} else {
					let sql2 = 'SELECT COUNT(*) AS COUNT FROM TICKETS T ';
					const params2 = [];
					if (q) {
						sql2 += 'WHERE CONTAINS(T.TITLE, ?) = 1 OR CONTAINS(T.DESCRIPTION, ?) = 1';
						params2.push(q, q);
					} 
					return ibmdb.execute(sql2, params2)
						.then(data2 => {
							res.send({
								tickets: data,
								count: data2[0].COUNT
							});
						});
				}
			})
			.catch(err => res.status(400).send({
				status: 400,
				message: err.message || 'An unknown error has occurred.'
			}));
	});

router.route('/:id')
	.get((req, res, next) => {
		const ticketId = req.params.id;

		const sql = 'SELECT T.*, U.NAME AS SELLER FROM TICKETS T, USERS U ' +
						'WHERE T.TICKET_ID = ? ' +
						'AND T.SELLER_ID = U.USER_ID';

		ibmdb.execute(sql, [ticketId])
			.then(data => {
				if (data.length === 0) {
					res.status(404).send('Ticket not found.');
				} else {
					res.send(data[0]);
				}
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
