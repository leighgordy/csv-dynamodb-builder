const AWSConfig = require('../data/AWS-config.json');
const AWS = require('aws-sdk')
const configs = require('../data/table-list.json');

AWS.config.update(AWSConfig);
const dynamodb = new AWS.DynamoDB();

(async() =>{
  try {
    const response = await dynamodb.listTables().promise();
    if (response.TableNames.length > 0) {
      console.log('Database has tables, must be empty for script to run')
    } else {
      configs.forEach(async (config) => {
        const table = require(`../data/${config.table}`);
        await dynamodb.createTable(table).promise();
      });
    }
  } catch (err) {
    console.log(err.message);
  }
})();