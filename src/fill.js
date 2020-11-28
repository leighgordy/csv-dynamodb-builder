const AWSConfig = require('../data/AWS-config.json');
const csv = require('csv-parser');
const fs = require('fs');
const AWS = require('aws-sdk')
const configs = require('../data/table-list.json');

const ROOT_DIR = './data/';

AWS.config.update(AWSConfig);
const dynamodb = new AWS.DynamoDB();

const batchPut = async (tableName, recordBatch) => {
  if(recordBatch.length > 0) {
    let payload = {RequestItems: {}};
    payload.RequestItems[tableName] = [];
    recordBatch.forEach((record) => {
      const Item = {};
      Object.keys(record).forEach((key) => {
        Item[key] = AWS.DynamoDB.Converter.marshall(record[key]);
        switch(typeof record[key]) {
          case 'number':
            Item[key] = {
              N: `${record[key]}`,
            };
            break;
          case 'string':
            Item[key] = {
              S: record[key],
            };
            break;
          case 'boolean':
            Item[key] = {
              BOOL: record[key],
            };
            break;
          default:
            if(Array.isArray(record[key])) {
              if(record[key].every(i => (typeof i === "number"))) {
                Item[key] = {
                  NS: AWS.DynamoDB.Converter.marshall(record[key]),
                };
              } else if(record[key].every(i => (typeof i === "string"))){
                  Item[key] = {
                    SS: AWS.DynamoDB.Converter.marshall(record[key]),
                  };
                } else {
                  Item[key] = {
                    L: AWS.DynamoDB.Converter.marshall(record[key]),
                  };
                }
              } else {
              Item[key] = {
                M: AWS.DynamoDB.Converter.marshall(record[key]),
              };
            }
        }
      });
      payload.RequestItems[tableName].push({
        PutRequest: {
          Item
        }
      })
    });
    return dynamodb.batchWriteItem(payload).promise();
  }
};

(async() => {
  const results = [];
  try {
    configs.forEach((config) => {
      const table = require(`../data/${config.table}`);
      const csvPaths = Array.isArray(config.data) ? config.data : [config.data];
      csvPaths.forEach((csvPath) => {
        let cnt = 0;
        let records = [];
        fs.createReadStream(`${ROOT_DIR}${csvPath}`)
          .pipe(csv())
          .on('data', async (data, index) => {
            cnt++;
            const parsedData = {};
            Object.keys(data).forEach((key) => {
              try {
                parsedData[key] = JSON.parse(data[key]);
              } catch (e) {
                let value = data[key];
                if (value.includes('#LOOP_CNT#')) {
                  value = value.replace('#LOOP_CNT#', cnt);
                } else if (value.startsWith('#TEMPLATE#')) {
                  value = require(value.replace('#TEMPLATE#', ''));
                }
                parsedData[key] = value;
              }
            });
            records.push(parsedData);
          })
          .on('end', async () => {
            let cnt = 0;
            do {
              if ((cnt + 25) < records.length) {
                await batchPut(table.TableName, records.slice(cnt, cnt + 25));
              } else {
                await batchPut(table.TableName, records.slice(cnt, records.length));
              }
              cnt += 25
            }
            while (cnt < records.length);
          });
      });
    });
  } catch (err) {
    console.log(err.message);
  }
})();