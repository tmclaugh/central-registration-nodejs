"use strict";
var express = require('express');
var router = express.Router();

router.get('/ping', function(req, res) {
  res.send({status: 'OK'})
});

// Custom routes
router.use('/dns', require('./dns'));

module.exports = router;
