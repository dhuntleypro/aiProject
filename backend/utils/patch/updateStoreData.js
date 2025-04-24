const AWS = require('aws-sdk');
const util = require('../util');


AWS.config.update({
  region: 'us-east-1',
});

const dynamodb = new AWS.DynamoDB.DocumentClient();



// // Function to update store data in DynamoDB
async function updateStoreData(store_id, array) {
  const params = {
    TableName: 'prof-website-store-table',
    Key: { id: store_id },
    UpdateExpression: 'SET #store_users = :store_users',
    ExpressionAttributeNames: { '#store_users': 'store_users' },
    ExpressionAttributeValues: { ':store_users': array },
  };

  try {
    await dynamodb.update(params).promise();
  } catch (error) {
    return util.buildResponse(500, error); // added to store

  }
}


module.exports.updateStoreData = updateStoreData;


