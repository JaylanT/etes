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
		let sellerId;
		try {
			const decoded = jwt.verify(token, jwtConfig.secret);
			sellerId = decoded.sub;
		} catch(err) {
			return res.status(401).end();
		}

		const sql = 'INSERT INTO TICKETS (SELLER_ID, TITLE, DESCRIPTION, PRICE, CATEGORY_ID, CREATED_AT) ' +
						'VALUES (?, ?, ?, ?, (SELECT CATEGORY_ID FROM CATEGORIES WHERE NAME = ?), CURRENT TIMESTAMP)';
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

router.route('/:id/purchase')
	.post((req, res, next) => {
		const ticketId = req.params.id;

		const token = req.headers.authorization.split(' ')[1];
		let buyerId;
		try {
			const decoded = jwt.verify(token, jwtConfig.secret);
			buyerId = decoded.sub;
		} catch(err) {
			return res.status(401).end();
		}

		const insertOrder = 'INSERT INTO ORDERS (TICKET_ID, BUYER_ID)';
		const params = [ticketId, buyerId];

		const updateTicket = 'UPDATE TICKETS SET SOLD = 1 WHERE TICKET_ID = ?';
		const params2 = [ticketId];

		ibmdb.open().then(conn => {
				return conn.beginTransactionAsync()
					.then(() => {
						return ibmdb.prepareAndExecuteNonQuery(conn, insertOrder, params);
					})
					.then(ret => {
						if (ret !== 1) {
							throw Error('Purchase failed.');
						}
						return ibmdb.prepareAndExecuteNonQuery(conn, updateTicket, params2);
					})
					.then(ret => {
						if (ret !== 1) {
							throw Error('Purchase failed.');
						}
						return conn.commitTransactionAsync();
					})
					.then(() => {
						res.send({ message: 'ok' });
						conn.closeSync();
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
