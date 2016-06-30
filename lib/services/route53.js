"use strict";
var aws = require('aws-sdk');

function createRecord(zoneName, rr) {
  aws.config.region = 'us-east-1';
  var route53 = new aws.Route53();

  var listHostedZonesParams = {DNSName: zoneName, MaxItems: '1'};
  var hostedZone = route53.listHostedZonesByName(listHostedZonesParams, function(err, data) {
    if (err) {
      console.log(err, err.stack);
    } else if (data && data.HostedZones.length === 0) {
      console.log('No hosted zone found when searching for:', zoneName);
    } else if (data && data.HostedZones[0].Name !== zoneName) {
      console.log('Unexpected zone found;', zoneName, '!=', data.HostedZones[0].Name);
    } else {
      console.log(data)
    }
  });

  var hostedZoneId = hostedZone.response.data.HostedZones[0].Id
  var rrParams = {
    ChangeBatch: {
      Changes: [
        {
          Action: 'CREATE',
          ResouceRecordSet: rr
        }
      ]
    },
    HostedZoneId: hostedZoneId
  };

  route53.changeResouceRecordSet(rrParams, function(err, data) {
    if (err) {
      console.log(err, err.stack);
    };
  });

};

exports.createRecord = createRecord;
