const AWSConfig = require('../data/AWS-config.json');
const AWS = require('aws-sdk');

AWS.config.update(AWSConfig);
const dynamodb = new AWS.DynamoDB();

(async() =>{
  try {
    const response = await dynamodb.listTables().promise();
    console.log(response);
  } catch (err) {
    console.log(err.message);
  }
})();