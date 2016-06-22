"use strict";

var express = require('express');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var app = express();

app.use(bodyParser.json());
app.use('/api/v1', routes);

module.exports = app;
