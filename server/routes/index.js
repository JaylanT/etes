const router = require('express').Router();
const authCheckMiddleware = require('../middleware/auth-check');


router.get('/', (req, res) => {
	res.send("Hello from ETES API");
});

router.use('/tickets', require('./tickets'));

router.use('/tickets', authCheckMiddleware);
router.use('/tickets', require('./tickets-auth'));

router.use('/orders', authCheckMiddleware);
router.use('/orders', require('./orders'));

router.use('/auth', require('./auth'));

router.use((err, req, res, next) => {
	res.status(500).send(err.message);
});

module.exports = router;
