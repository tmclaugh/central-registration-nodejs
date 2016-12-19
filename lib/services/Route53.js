"use strict";
const aws = require('aws-sdk');

// Private
/**
  * Construct an Error object, typically from an AWS error.
  *
  * @param {string} code - Error response code.
  * @param {string} message - Error response message
  * @param {integer} code - HTTP response code.
  * @return {Error} Error Object
  *
  */
function constructError(code, message, statusCode) {
  var e = new Error();
  e.code = code;
  e.statusCode = statusCode;
  e.message = message;

  return e
}

/**
  * Return a Route53 resource records changeset object.
  *
  * @param {string} action - Route 53 record action; from Route53 API.
  * @param {Object} rr - Resouce record object.
  * @return {Object} Resource Record changeset object.
  *
  */
function constructRRParams(action, rr, zoneId) {
  var rrParams = {
    ChangeBatch: {
      Changes: [
        {
          Action: action,
          ResourceRecordSet: rr
        }
      ]
    },
    HostedZoneId: zoneId
  };

  return rrParams;
};

// Public
function Route53 () {
  aws.config.region = 'us-east-1';
  this.r53 = new aws.Route53();
}

/**
  * Change a Route53 Resource Record set.
  *
  * @param {string} hostedZone - Name of zone containing record to be changed.
  * @param {string} action - Route53 change action; from API.
  * @param {Object} rr - Resource Record object.
  * @param {changeResourceRecordSetsCallback} callback
  *
  */
Route53.prototype.changeResourceRecordSets = function (hostedZone, action, rr, callback) {
  var self = this;

  // Create our change set.
  var rrParams = constructRRParams(action, rr, hostedZone.Id)

  // Change record.
  self.r53.changeResourceRecordSets(rrParams, function (err, data) {
    if (err) {
      return callback(constructError(err.code, err.message, err.statusCode));
    };

    callback(null, data);
  });
};


/**
  * Get hosted zones.
  *
  * @param {String} zoneName - AWS zone name.
  * @param {hostedZoneCallback}
  *
  * @callback hostedZoneCallback
  * @param {Error} err - Error object.
  * @param {Object} data - AWS Hosted zone object.
  */
Route53.prototype.getHostedZone = function (zoneName, hostedZoneCallback) {
  var self = this;
  var listHostedZonesParams = {DNSName: zoneName, MaxItems: '1'};

  // start
  self.r53.listHostedZonesByName(listHostedZonesParams, function(err,data) {
    if (err) {
      return hostedZoneCallback(constructError(err.code, err.message, err.statusCode));
    } else if (data && (data.HostedZones.length === 0 || data.HostedZones[0].Name !== zoneName)) {
      var code = 'Route53ZoneNotFound';
      var message = 'No hosted zone found when searching for: ' + zoneName;
      var statusCode = 400;
      return hostedZoneCallback(constructError(code, message, statusCode));
    }

    hostedZoneCallback(null, data.HostedZones[0]);
  });

};


/**
  * Create resource record.
  *
  * @param {string} zoneName - Name of zone to create record in.
  * @param {Object} rr - Resource record.
  * @param {changeResourceRecordSetsCallback} callback
  *
  * @callback changeResourceRecordSetsCallback
  * @param {Error} err - Error object.
  * @param {Object} data - AWS Response data.
  */
Route53.prototype.createRecord = function (zoneName, rr, callback) {
  var self = this;

  // start
  self.getHostedZone(zoneName, function(err, hostedZone) {
    if(err) { return callback(err); }

    self.changeResourceRecordSets(hostedZone, 'CREATE', rr, function(err, data) {
      if(err) { return callback(err); }

      callback(null, data)
    });
  });
};


Route53.prototype.deleteRecord = function (zoneName, rr, callback) {
  var self = this;

  self.getHostedZoneId(zoneName, changeResourceRecordSets);

  function changeResourceRecordSets(hostedZoneId) {
    // Create our change set.
    var hostedZoneId = hostedZoneId
    var rrParams = {
      ChangeBatch: {
        Changes: [
          {
            Action: 'DELETE',
            ResourceRecordSet: rr
          }
        ]
      },
      HostedZoneId: hostedZoneId
    };

    // Change record.
    self.r53.changeResourceRecordSets(rrParams, returnData);
  };

  function returnData(err, data) {
    if (err) {
      return callback(constructError(err.code, err.message, err.statusCode));
    };
    return callback(null, data);
  };
};

Route53.prototype.alterRecord = function (zoneName, rr, callback) {
  var self = this;

  self.getHostedZoneId(zoneName, changeResourceRecordSets);

  function changeResourceRecordSets(hostedZoneId) {
    // Create our change set.
    var hostedZoneId = hostedZoneId
    var rrParams = {
      ChangeBatch: {
        Changes: [
          {
            Action: 'UPSERT',
            ResourceRecordSet: rr
          }
        ]
      },
      HostedZoneId: hostedZoneId
    };

    // Change record.
    self.r53.changeResourceRecordSets(rrParams, returnData);
  };

  function returnData(err, data) {
    if (err) {
      return callback(constructError(err.code, err.message, err.statusCode));
    };
    return callback(null, data);
  };
};

Route53.prototype.getRecord = function (zoneName, rrName, rrType, callback) {
  var self = this;

  self.getHostedZoneId(zoneName, listResouseReordSets);

  function listResouseReordSets(hostedZoneId) {
    var params = {
      HostedZoneId: hostedZoneId,
      StartRecordName: rrName,
      StartRecordType: rrType,
      MaxItems: '1'
    };

    // Get record.
    self.r53.listResourceRecordSets(params, returnData);
  };

  function returnData(err, data) {
    if (err) {
      return callback(constructError(err.code, err.message, err.statusCode));
    } else if (data && (data.ResourceRecordSets.length === 0 || data.ResourceRecordSets[0].Name !== rrName || data.ResourceRecordSets[0].Type !== rrType)) {
      var code = 'Route53RRNotFound';
      var message = `Record not found: zoneName=${zoneName}, rrName=${rrName}, rrType=${rrType}`;
      var statusCode = 400;

      return callback(constructError(code, message, statusCode));
    } else {
      return callback(null, data);
    }
  };
};

module.exports = Route53;
