// Sample Event
// { "Filter": { "Name": "tag:TerminationGroup", "Values": [ "KILL_ME" ] } }
// Be shure to have an EC2 instance with tag "TerminationGroup" and value "KILL_ME"
// http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#terminateInstances-property

var AWS = require('aws-sdk');
AWS.config.apiVersions = {
  ec2: '2015-10-01'
};
var ec2 = new AWS.EC2();

exports.handler = function(event, context) {
    var _params = { InstanceIds: [] };    
    ec2.describeInstances({ Filters: [ event.Filter ] }, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else {
        data.Reservations.forEach(function(r) {
            r.Instances.forEach(function(i) {
                _params.InstanceIds.push(i.InstanceId);
            });
        });
        ec2.terminateInstances(_params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else     console.log(data);           // successful response
            context.done();  
        });
      }
    });
};