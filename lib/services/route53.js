"use strict";
const aws = require('aws-sdk');

function createRecord(zoneName, rr, callback) {
  aws.config.region = 'us-east-1';
  var r53 = new aws.Route53();

  // Get hosted zones.  Will need zone ID later.
  var listHostedZonesParams = {DNSName: zoneName, MaxItems: '1'};
  r53.listHostedZonesByName(listHostedZonesParams, function(err, data) {
    if (err) {
      return callback(err)
    } else if (data && data.HostedZones.length === 0) {
      var msg = 'No hosted zone found when searching for: ' + zoneName;
      return callback(Error(msg));
    } else if (data && data.HostedZones[0].Name !== zoneName) {
      var msg = 'Unexpected zone found; ' + zoneName + ' != ' + data.HostedZones[0].Name;
      return callback(Error(msg));
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
        return callback(err);
      };
      return callback(null, data);
    });
  });
};

exports.createRecord = createRecord;
