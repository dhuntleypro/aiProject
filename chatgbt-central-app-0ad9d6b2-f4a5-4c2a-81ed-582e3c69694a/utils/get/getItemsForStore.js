const AWS = require('aws-sdk');
const scanDynamoRecords = require('./scanDynamoRecords');


AWS.config.update({
  region: 'us-east-1',
});


const dynamodb = new AWS.DynamoDB.DocumentClient();






async function getItemsForStore(tableName, store_id) {
  const params = {
    TableName: tableName,
    FilterExpression: '#store_id = :store_id',
    ExpressionAttributeNames: { '#store_id': 'store_id' },
    ExpressionAttributeValues: { ':store_id': store_id },
  };

  try {
    const allItems = await scanDynamoRecords.scanDynamoRecords(params, []);
    return allItems;
  } catch (error) {
    throw error;
  }
}




module.exports.getItemsForStore = getItemsForStore;
