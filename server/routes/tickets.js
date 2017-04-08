const router = require('express').Router();
const ibmdb = require('../modules/ibmdb');


router.route('/')
	.get((req, res, next) => {
		const limit = parseInt(req.query.limit) || 30,
				page = parseInt(req.query.page) || 1,
				order = req.query.order,
				q = req.query.q;

		// limit max of 100
		if (limit > 100) limit = 100;
		
		const offset = (page - 1) * limit;
		const params = [];

		let sql = 'SELECT T.* FROM TICKETS T ';;

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
					res.send({ message: 'No tickets available.' });
				} else {
					let sql2 = 'SELECT COUNT(*) AS COUNT FROM TICKETS T ';
					const params2 = [];
					if (q) {
						sql2 += 'WHERE CONTAINS(T.TITLE, ?) = 1 OR CONTAINS(T.DESCRIPTION, ?) = 1';
						params2.push(q, q);
					} 
					return ibmdb.execute(sql2, params2)
						.then(data2 => {
							if (data2.length === 0)
								return res.status(500).send({ message: 'Unknown database error.' });

							const count = data2[0].COUNT;
							const links = generateLinks(count, limit, page, q, order);
							res.links(links);

							res.send({
								tickets: data,
								count
							})
						});
				}
			})
			.catch(err => res.status(400).send({
				status: 400,
				message: err.message || 'An unknown error has occurred.'
			}));
	});

function generateLinks(count, limit, page, q, order) {
	const lastPageNum = Math.ceil(count / limit);

	let	nextPage = page === lastPageNum ? '' : '/tickets?page=' + (page + 1) + '&limit=' + limit,
		prevPage = page === 1 ? '' : '/tickets?page=' + (page - 1) + '&limit=' + limit,
		firstPage = '/tickets?page=1&limit=' + limit,
		lastPage = '/tickets?page=' + lastPageNum + '&limit=' + limit;

	if (q) {
		if (nextPage) nextPage += '&q=' + q;
		if (prevPage) prevPage += '&q=' + q;
		firstPage += '&q=' + q;
		lastPage += '&q=' + q;
	}

	if (order) {
		if (nextPage) nextPage += '&order=' + order;
		if (prevPage) prevPage += '&order=' + order;	
		firstPage += '&order=' + order;
		lastPage += '&order=' + order;
	}

	return {
		next: nextPage,
		previous: prevPage,
		first: firstPage,
		last: lastPage
	};
}

router.route('/:id')
	.get((req, res, next) => {
		const ticketId = req.params.id;

		const sql = 'SELECT T.* FROM TICKETS T ' +
						'WHERE T.TICKET_ID = ? '; 

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
