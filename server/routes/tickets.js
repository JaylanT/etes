const router = require('express').Router();
const ibmdb = require('../modules/ibmdb');


router.route('/')
	.get((req, res, next) => {
		const limit = req.query.limit || 50,
				start = req.query.start || 0,
				orderBy = req.query.orderBy,
				keywords = req.query.keywords;

		// limit max of 50
		if (limit > 50) limit = 50;

		const params = [limit, start];
		let sql = 'SELECT T.*, U.NAME AS SELLER FROM TICKETS T, USERS U ' +
					 'WHERE T.SELLER_ID = U.USER_ID '
		if (keywords) {
			sql += 'AND (CONTAINS(T.TITLE, ?) = 1 OR CONTAINS(T.DESCRIPTION, ?) = 1) ';
			params.unshift(keywords, keywords);
		} 

		const orderByIdentifier = getOrderByIdentifier(orderBy);
		sql += 'ORDER BY ' + orderByIdentifier + ' LIMIT ? OFFSET ?';

		ibmdb.execute(sql, params)
			.then(data => {
				if (data.length === 0) {
					res.send('No tickets available.');
				} else {
					res.send(data);
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
	}
	return identifier;
}

module.exports = router;
