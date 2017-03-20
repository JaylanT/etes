const router = require('express').Router();
const ibmdb = require('ibm_db');
const config = require('../config');

router.route('/')
.get((req, res, next) => {
	ibmdb.open(config, (err, conn) => {
		if (err) return console.log(err);

		conn.query('select * from myTest', (err, data) => {
			if (err) console.log(err);
			else console.log(data);

			conn.close(() => {
				console.log('done');
			});
			res.json(data);
		});
	});
});

module.exports = router;
