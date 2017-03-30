const router = require('express').Router();

router.get('/', (req, res) => {
	res.send("Hello from ETES API");
});

router.use('/test', require('./testRoutes'));
router.use('/', require('./user'));

router.use((err, req, res, next) => {
	res.status(500).send(err.message);
});

module.exports = router;
