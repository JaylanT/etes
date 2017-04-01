const router = require('express').Router();
const ibmdb = require('../modules/ibmdb');


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

		ibmdb.execute(sql, [limit, start])
			.then(data => res.send(data))
			.catch(err => res.status(400).send({
				status: 400,
				message: err.message
			}));
	});

router.route('/:id')
	.get((req, res, next) => {
		const ticketId = req.params.id;

		const sql = 'SELECT T.*, U.NAME AS SELLER FROM TICKETS T, USERS U ' +
						'WHERE T.TICKET_ID = ? ' +
						'AND T.SELLER_ID = U.USER_ID';

		ibmdb.execute(sql, [ticketId])
			.then(data => res.send(data))
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
