central-registration-nodejs
===

Manages stuff.

## DNS: /api/v1/dns
The DNS endpoint can create, delete, alter recods in AWS Route53.  It is
currently not very smart and mostly acts as a proxy to the Route53 API.

### POST: /api/v1/dns
Create a DNS record.
`$ curl -s -H "Content-Type: application/json" -X POST -d '{"HostedZone":"example.com.", "rr":{"Name":"i-deadbeef.example.com.", "Type":"A", "TTL":300, "ResourceRecords":[{"Value":"127.0.0.1"}]}}' http://localhost:8080/api/v1/dns`

### PUT: /api/v1/dns/:rrName
Alter a DNS record.
`curl -s -H "Content-Type: application/json" -X PUT -d '{"HostedZone":"example.com.", "rr":{"Type":"A", "TTL":10, "ResourceRecords":[{"Value": "127.0.0.1"}]}}' http://localhost:8080/api/v1/dns/i-deadbeef.example.com.`

### GET: /api/v1/dns/:rrName
Return a DNS record.
`curl -s -H "Content-Type: application/json" -X GET -d '{"HostedZone":"example.com.", "rr":{"Type":"A"}}' http://localhost:8080/api/v1/dns/i-deadbeef.example.com.`

### DELETE: /api/v1/dns/:rrName
Delete a DNS record
`curl -s -H "Content-Type: application/json" -X DELETE -d '{"HostedZone":"example.com.", "rr":{"Type":"A", "TTL":10, "ResourceRecords":[{"Value": "127.0.0.1"}]}}' http://localhost:8080/api/v1/dns/i-deadbeef.example.com.`
