"use strict";
const express = require('express');
const Route53 = require ('../services/Route53');

const router = express.Router();

router.get('/ping', function(req, res) {
  res.send({status: 'OK'});
});

router.post('/', function(req, res) {
  console.log(req.body.HostedZone);
  console.log(req.body.rr);

  var r53 = new Route53();
  r53.createRecord(req.body.HostedZone, req.body.rr, function(err, data) {
    if (err) {
      res.status(err.statusCode).send({status: 'FAIL', dns: err});
    } else {
      // TODO: Call getRecord() to ensure record has been created.  Should
      // loop X times before throwing an error.
      res.send({status: 'OK', dns: data});
    }
  });
});

router.put('/:rrName', function(req, res) {
  var rrName = req.params.rrName;
  req.body.rr['Name'] = rrName;

  console.log(req.body.HostedZone);
  console.log(req.body.rr);

  var r53 = new Route53();
  r53.alterRecord(req.body.HostedZone, req.body.rr, function(err, data) {
    if (err) {
      res.status(err.statusCode).send({status: 'FAIL', dns: err});
    } else {
      // TODO: Call getRecord() to ensure record has been deleted.  Should
      // loop X times before throwing an error.
      res.send({status: 'OK', dns: data});
    }
  });
});

router.delete('/:rrName', function(req, res) {
  var rrName = req.params.rrName;
  req.body.rr['Name'] = rrName;

  console.log(req.body.HostedZone);
  console.log(req.body.rr);

  var r53 = new Route53();
  r53.deleteRecord(req.body.HostedZone, req.body.rr, function(err, data) {
    if (err) {
      res.status(err.statusCode).send({status: 'FAIL', dns: err});
    } else {
      // TODO: Call getRecord() to ensure record has been deleted.  Should
      // loop X times before throwing an error.
      res.send({status: 'OK', dns: data});
    }
  });
});

router.get('/:rrName', function(req, res) {
  var rrName = req.params.rrName;

  console.log(req.body.HostedZone);
  console.log(req.body.rr);

  var r53 = new Route53();
  r53.getRecord(req.body.HostedZone, req.params.rrName, req.body.rr.Type, function(err, data) {
    if (err) {
      console.log(err)
      res.status(err.statusCode).send({status: 'FAIL', dns: err});
    } else {
      res.send({status: 'OK', dns: data});
    }
  });
});

module.exports = router;
