import configs from '../data/config.json';
import AWSConfig from '../data/AWS-config.json';
import AWS from 'aws-sdk';

AWS.config.update(AWSConfig);

const dynamodb = new AWS.DynamoDB();
(async() =>{
  const response = await dynamodb.listTables().promise();
  if(response.TableNames.length > 0) {
    console.log('Database has tables, must be empty for script to run')
  } else {
    configs.forEach(async (config) => {
      const table = await import(`../data/${config.table}`);
      await dynamodb.createTable(table.default).promise();
    });
  }
})();