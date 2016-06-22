"use strict";

var express = require('express');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var expressWinston = require('express-winston');
var winston = require('winston'); // for transports.Console

var app = express();

// express-winston logger makes sense BEFORE the router.
app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console({
      json: true,
      colorize: true
    })
  ]
}));

app.use(bodyParser.json());
app.use('/api/v1', routes);

module.exports = app;
