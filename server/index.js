const express = require('express');
const api = require('./routes');
const bodyParser = require('body-parser');
const passport = require('passport');
const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
	// CORS
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	res.header('Access-Control-Expose-Headers', 'Link');

	if ('OPTIONS' === req.method) {
		res.sendStatus(200);
	} else {
		next();
	}
});

app.use(passport.initialize());

const localSignupStrategy = require('./passport/local-signup');
const localLoginStrategy = require('./passport/local-login');
passport.use('local-signup', localSignupStrategy);
passport.use('local-login', localLoginStrategy);

app.use('/api', api);

app.listen(3100);
console.log('listening on 3100');
