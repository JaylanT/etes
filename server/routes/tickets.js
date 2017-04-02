const router = require('express').Router();
const ibmdb = require('../modules/ibmdb');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt-config');


router.route('/')
	.post((req, res, next) => {
		const data = req.body;
		const validation = validateTicket(data);

		if (!validation.success) {
			delete validation.success;
			return res.status(400).json(validation);
		}

		// jwt should have been previously verified
		const token = req.headers.authorization.split(' ')[1];
		const decoded = jwt.verify(token, jwtConfig.secret);
		let sellerId;
		try {
			sellerId = decoded.sub;
		} catch(err) {
			return res.status(401).end();
		}

		const sql = 'INSERT INTO TICKETS (SELLER_ID, LISTING_TITLE, DESCRIPTION, PRICE, CREATED_AT) ' +
						'VALUES (?, ?, ?, ?, CURRENT TIMESTAMP)';

		ibmdb.executeNonQuery(sql, [sellerId, data.listingTitle, data.description, data.price])
			.then(ret => {
				if (ret !== 1) {
					throw Error('Insert failed.');
				}
				res.send('Ticket inserted.');
			})
			.catch(err => res.status(400).send({
				status: 400,
				message: err.message
			}));
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

function validateTicket(payload) {
	let isFormValid = true;
	const errors = {};

	if (!payload || typeof payload.listingTitle !== 'string' || payload.listingTitle.trim().length === 0) {
		isFormValid = false;
		errors.listingTitle = 'Please enter a listing title.';
	}
	if (!payload || typeof payload.description !== 'string' || payload.description.trim().length === 0) {
		isFormValid = false;
		errors.description = 'Please enter a description.';
	}
	if (!payload || isNaN(payload.price) || payload.price <= 0) {
		isFormValid = false;
		errors.price = 'Please enter a price above $0.00.';
	}

	const message = isFormValid ? '' : 'Form validation failed.';

	return {
		success: isFormValid,
		message,
		errors
	};
}

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
