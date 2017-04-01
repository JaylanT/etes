const router = require('express').Router();
const db2 = require('../modules/db2');


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
		const sql = 'SELECT T.*, U.NAME AS SELLER FROM TICKETS T, USERS U ' +
						'WHERE T.SELLER_ID = U.USER_ID ' +
						'ORDER BY ' + orderByIdentifier + ' LIMIT ? OFFSET ?'

		db2.executeSql(sql, [limit, start])
			.then(data => res.send(data))
			.catch(err => res.status(400).send(err));
	});

router.route('/:id')
	.get((req, res, next) => {
		const ticketId = req.params.id;

		const sql = 'SELECT T.*, U.NAME AS SELLER FROM TICKETS T, USERS U ' +
						'WHERE T.TICKET_ID = ? ' +
						'AND T.SELLER_ID = U.USER_ID';

		db2.executeSql(sql, [ticketId])
			.then(data => res.send(data))
			.catch(err => res.status(400).send(err));
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
