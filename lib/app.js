"use strict";

var express = require('express');
var routes = require('./routes/index');
var app = express();

app.use('/api/v1', routes);

module.exports = app;
