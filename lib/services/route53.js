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
function createRecord(zoneName, rr, callback) {
  aws.config.region = 'us-east-1';
  var r53 = new aws.Route53();

  // Get hosted zones.  Will need zone ID later.
  var listHostedZonesParams = {DNSName: zoneName, MaxItems: '1'};
  r53.listHostedZonesByName(listHostedZonesParams, function (err, data) {
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
    r53.changeResourceRecordSets(rrParams, function(err, data) {
      if (err) {
        return callback(constructError(err.code, err.message, err.statusCode));
      };
      return callback(null, data);
    });
  });
};

exports.createRecord = createRecord;
