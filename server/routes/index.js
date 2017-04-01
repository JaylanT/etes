const router = require('express').Router();

router.get('/', (req, res) => {
	res.send("Hello from ETES API");
});

const authCheckMiddleware = require('../middleware/auth-check');
router.use('/test', authCheckMiddleware);
router.use('/test', require('./testRoutes'));
router.use('/auth', require('./auth'));

router.use((err, req, res, next) => {
	res.status(500).send(err.message);
});

module.exports = router;
