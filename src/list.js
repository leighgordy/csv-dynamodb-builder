import AWSConfig from '../data/AWS-config.json';
import AWS from 'aws-sdk';

AWS.config.update(AWSConfig);

const dynamodb = new AWS.DynamoDB();
(async() =>{
  const response = await dynamodb.listTables().promise();
  console.log(response);
})();