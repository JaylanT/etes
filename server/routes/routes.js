const router = require('express').Router();

router.get('/', (req, res) => {
	res.json({"error" : false,"message" : "Hello World"});
});

router.use('/test', require('./test/testRoutes'));

router.use((err, req, res, next) => {
	res.status(500).send(err.message);
});

module.exports = router;
