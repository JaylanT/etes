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

		const sql = 'INSERT INTO TICKETS (SELLER_ID, TITLE, DESCRIPTION, PRICE, CATEGORY, CREATED_AT) ' +
						'VALUES (?, ?, ?, ?, ?, CURRENT TIMESTAMP)';
		const params = [sellerId, data.title, data.description, data.price, data.category];

		ibmdb.open().then(conn => {
			return ibmdb.prepareAndExecuteNonQuery(conn, sql, params)
				.then(ret => {
					conn.close();
					if (ret !== 1) {
						throw Error('Insert failed.');
					}
					res.send({ message: 'Ticket inserted.' });
				});
		})
		.catch(err => {
			res.status(400).send({
				status: 400,
				message: err.message || 'An unknown erorr has occurred.'
			});
		});
	});

function validateTicket(payload) {
	let isFormValid = true;
	const errors = {};

	if (!payload || typeof payload.title !== 'string' || payload.title.trim().length === 0) {
		isFormValid = false;
		errors.title = 'Please enter a listing title.';
	}
	if (!payload || typeof payload.description !== 'string' || payload.description.trim().length === 0) {
		isFormValid = false;
		errors.description = 'Please enter a description.';
	}
	if (!payload || isNaN(payload.price) || payload.price <= 0) {
		isFormValid = false;
		errors.price = 'Please enter a price above $0.00.';
	}
	const categories = ['Music', 'Sports', 'Arts & Theater', 'Family', 'Other'];
	if (!payload || typeof payload.category !== 'string' || categories.indexOf(payload.category) < 0) {
		isFormValid = false;
		errors.category = 'Please select a category.';
	}

	const message = isFormValid ? '' : 'Form validation failed.';

	return {
		success: isFormValid,
		message,
		errors
	};
}

module.exports = router;
