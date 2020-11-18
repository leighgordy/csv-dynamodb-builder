const AWSConfig = require('../data/AWS-config.json');
const AWS = require('aws-sdk')
const configs = require('../data/config.json');

AWS.config.update(AWSConfig);

const dynamodb = new AWS.DynamoDB();

(async() =>{
  const response = await dynamodb.listTables().promise();
  if(response.TableNames.length === 0) {
    console.log('Database already empty')
  } else {
    configs.forEach(async (config) => {
      const table = await import(`../data/${config.table}`);
      await dynamodb.deleteTable({ TableName: table.default.TableName }).promise();
    });
  }
})();
