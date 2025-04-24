const AWS = require('aws-sdk');
const scanDynamoRecords = require('./scanDynamoRecords');


AWS.config.update({
  region: 'us-east-1',
});


async function getAllItems(tableName) {
  const params = {
    TableName: tableName,
  };

  try {
    const allItems = await scanDynamoRecords(params, []);
    return allItems;
  } catch (error) {
    throw error;
  }
}



module.exports.getAllItems = getAllItems;
