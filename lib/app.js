"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/index');
const expressWinston = require('express-winston');
const winston = require('winston'); // for transports.Console

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
