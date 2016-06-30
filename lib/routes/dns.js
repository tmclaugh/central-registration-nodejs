"use strict";
const express = require('express');
const route53 = require ('../services/route53');

const router = express.Router();

router.post('/', function(req, res) {
  console.log(req.body.hosted_zone);
  console.log(req.body.rr);

  route53.createRecord(req.body.hosted_zone, req.body.rr, function(err, data) {
    if (err) {
      res.send({status: 'FAIL', dns: err})
    } else {
      res.send({status: 'OK', dns: data})
    }
  });
});

router.get('/ping', function(req, res) {
  res.send({status: 'OK'});
});

module.exports = router;
