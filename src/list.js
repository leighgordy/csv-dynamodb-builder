const AWSConfig = require('../data/AWS-config.json');
const AWS = require('aws-sdk');
AWS.config.update(AWSConfig);

const dynamodb = new AWS.DynamoDB();
(async() =>{
  const response = await dynamodb.listTables().promise();
  console.log(response);
})();