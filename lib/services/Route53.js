"use strict";
const aws = require('aws-sdk');

// Private
function constructError(code, message, statusCode) {
  var e = new Error();
  e.code = code;
  e.statusCode = statusCode;
  e.message = message;

  return e
}

// Public
function Route53 () {
  aws.config.region = 'us-east-1';
  this.r53 = new aws.Route53();
}

Route53.prototype.createRecord = function (zoneName, rr, callback) {
  var self = this;

  // Get hosted zones.  Will need zone ID later.
  var listHostedZonesParams = {DNSName: zoneName, MaxItems: '1'};
  self.r53.listHostedZonesByName(listHostedZonesParams, onListHostedZones);

  function onListHostedZones(err, data) {
    if (err) {
      return callback(constructError(err.code, err.message, err.statusCode));
    } else if (data && (data.HostedZones.length === 0 || data.HostedZones[0].Name !== zoneName)) {
      var code = 'Route53ZoneNotFound';
      var message = 'No hosted zone found when searching for: ' + zoneName;
      var statusCode = 400;
      return callback(constructError(code, message, statusCode));
    }

    // Create our change set.
    var hostedZoneId = data.HostedZones[0].Id
    var rrParams = {
      ChangeBatch: {
        Changes: [
          {
            Action: 'CREATE',
            ResourceRecordSet: rr
          }
        ]
      },
      HostedZoneId: hostedZoneId
    };

    // Change record.
    self.r53.changeResourceRecordSets(rrParams, onChangeResourceRecordSet);
  };

  function onChangeResourceRecordSet(err, data) {
    if (err) {
      return callback(constructError(err.code, err.message, err.statusCode));
    };
    return callback(null, data);
  };
};

Route53.prototype.deleteRecord = function (zoneName, rr, callback) {
  var self = this;

  // Get hosted zones.  Will need zone ID later.
  var listHostedZonesParams = {DNSName: zoneName, MaxItems: '1'};
  self.r53.listHostedZonesByName(listHostedZonesParams, onListHostedZones);

  function onListHostedZones(err, data) {
    if (err) {
      return callback(constructError(err.code, err.message, err.statusCode));
    } else if (data && (data.HostedZones.length === 0 || data.HostedZones[0].Name !== zoneName)) {
      var code = 'Route53ZoneNotFound';
      var message = 'No hosted zone found when searching for: ' + zoneName;
      var statusCode = 400;
      return callback(constructError(code, message, statusCode));
    }

    // Create our change set.
    var hostedZoneId = data.HostedZones[0].Id
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
    self.r53.changeResourceRecordSets(rrParams, onChangeResourceRecordSet);
  };

  function onChangeResourceRecordSet(err, data) {
    if (err) {
      return callback(constructError(err.code, err.message, err.statusCode));
    };
    return callback(null, data);
  };
};

Route53.prototype.alterRecord = function (zoneName, rr, callback) {
  var self = this;

  // Get hosted zones.  Will need zone ID later.
  var listHostedZonesParams = {DNSName: zoneName, MaxItems: '1'};
  self.r53.listHostedZonesByName(listHostedZonesParams, onListHostedZones);

  function onListHostedZones(err, data) {
    if (err) {
      return callback(constructError(err.code, err.message, err.statusCode));
    } else if (data && (data.HostedZones.length === 0 || data.HostedZones[0].Name !== zoneName)) {
      var code = 'Route53ZoneNotFound';
      var message = 'No hosted zone found when searching for: ' + zoneName;
      var statusCode = 400;
      return callback(constructError(code, message, statusCode));
    }

    // Create our change set.
    var hostedZoneId = data.HostedZones[0].Id
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
    self.r53.changeResourceRecordSets(rrParams, onChangeResourceRecordSet);
  };

  function onChangeResourceRecordSet(err, data) {
    if (err) {
      return callback(constructError(err.code, err.message, err.statusCode));
    };
    return callback(null, data);
  };
};

Route53.prototype.getRecord = function (zoneName, rrName, rrType, callback) {
  var self = this;
  // Get hosted zones.  Will need zone ID later.
  var listHostedZonesParams = {DNSName: zoneName, MaxItems: '1'};
  self.r53.listHostedZonesByName(listHostedZonesParams, onListHostedZones);

  function onListHostedZones(err, data) {
    if (err) {
      return callback(constructError(err.code, err.message, err.statusCode));
    } else if (data && (data.HostedZones.length === 0 || data.HostedZones[0].Name !== zoneName)) {
      var code = 'Route53ZoneNotFound';
      var message = 'No hosted zone found when searching for: ' + zoneName;
      var statusCode = 400;
      return callback(constructError(code, message, statusCode));
    }

    var params = {
      HostedZoneId: data.HostedZones[0].Id,
      StartRecordName: rrName,
      StartRecordType: rrType,
      MaxItems: '1'
    };

    console.log(data)
    // Get record.
    self.r53.listResourceRecordSets(params, onListResourceRecordSet);
  };

  function onListResourceRecordSet(err, data) {
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
