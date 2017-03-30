const express = require('express');
const api = require('./routes/index');
const bodyParser = require('body-parser');
const passport = require('passport');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(passport.initialize());

const localSignupStrategy = require('./passport/local-signup');
passport.use('local-signup', localSignupStrategy);

app.use('/api', api);

app.listen(3100);
console.log('listening on 3100');
