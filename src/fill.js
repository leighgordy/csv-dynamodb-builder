const AWSConfig = require('../data/AWS-config.json');
const csv = require('csv-parser');
const fs = require('fs');
const AWS = require('aws-sdk')
const configs = require('../data/table-list.json');

const ROOT_DIR = './data/';

AWS.config.update(AWSConfig);
const docClient = new AWS.DynamoDB.DocumentClient();

(async() => {
  const results = [];
  configs.forEach((config) => {
    const table = require(`../data/${config.table}`);
    fs.createReadStream(`${ROOT_DIR}${config.data}`)
      .pipe(csv())
      .on('data', async (data) => {
        const parsedData = {};
        Object.keys(data).forEach((key) => {
          try {
            parsedData[key] = JSON.parse(data[key]);
          } catch (e) {
            parsedData[key] = data[key];
          }
        });
        console.log(parsedData);
        var params = {
          TableName: table.TableName,
          Item: parsedData,
        };
       await docClient.put(params).promise();
      });
  });
})();