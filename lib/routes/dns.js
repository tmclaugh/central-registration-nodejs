"use strict";
var express = require('express');
var route53 = require ('../services/route53');

var router = express.Router();

router.post('/', function(req, res) {
  console.log(req.body.hosted_zone);
  console.log(req.body.rr);

  var resp = route53.createRecord(req.body.hosted_zone, req.body.rr);
  res.send({status: 'OK', dns: resp})
});

router.get('/ping', function(req, res) {
  res.send({status: 'OK'});
});

module.exports = router;
