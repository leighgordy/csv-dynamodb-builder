const AWSConfig = require('../data/AWS-config.json');
const csv = require('csv-parser');
const fs = require('fs');
const AWS = require('aws-sdk')
const configs = require('../data/table-list.json');

const ROOT_DIR = './data/';

const replaceTokens = (data, template) => {
  let jsonStr = template;
  Object.keys(data).forEach((key) => {
    const find = 'abc';
    const re = new RegExp(`#${key}`, 'g');
    jsonStr = jsonStr.replace(re, data[key]);
  });
  console.log(jsonStr);
  return JSON.parse(jsonStr);
};

AWS.config.update(AWSConfig);
const docClient = new AWS.DynamoDB.DocumentClient();

(async() => {
  const results = [];
  configs.forEach((config) => {
    const table = require(`../data/${config.table}`);
    const template = fs.readFileSync(`./data/${config.template}`, 'utf8');
    fs.createReadStream(`${ROOT_DIR}${config.data}`)
      .pipe(csv())
      .on('data', async (data) => {
        const Item = replaceTokens(data, template);
        var params = {
          TableName: table.TableName,
          Item: Item,
        };
       await docClient.put(params).promise();
      });
  });
})();