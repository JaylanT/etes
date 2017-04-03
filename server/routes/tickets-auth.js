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

module.exports = router;
