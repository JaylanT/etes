const router = require('express').Router();
const Promise = require('bluebird');
const ibmdb = Promise.promisifyAll(require('ibm_db'));
//const ibmdb = require('ibm_db');
const config = require('../config/db-config');

router.route('/')
.get((req, res, next) => {
//  Callbacks
//	ibmdb.open(config, (err, conn) => {
//		if (err) return res.status(500).send(err.message);
//
//		conn.query('select * from test', (err, rows) => {
//			if (err) return res.status(400).send(err.message);
//
//			conn.close();
//			res.send(rows);
//		});
//	});

//  Promise
	ibmdb.open(config)
		.catch(err => res.status(500).send(err.message))
		.then(conn => { 
			return conn.query('select * from test')
						.then(rows => {
							conn.close();
							res.send(rows);
						});
		})
		.catch(err => res.status(400).send(err.message));
});

module.exports = router;
