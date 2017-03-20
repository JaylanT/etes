const express = require('express');
const app = express();
const api = require('./routes/routes');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api', api);

app.listen(3100);
console.log('listening on 3100');
