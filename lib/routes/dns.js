"use strict";
var express = require('express');
var route53 = require ('../services/route53');

var router = express.Router();

router.get('/ping', function(req, res) {
  res.send({status: 'OK'});
});

module.exports = router;
