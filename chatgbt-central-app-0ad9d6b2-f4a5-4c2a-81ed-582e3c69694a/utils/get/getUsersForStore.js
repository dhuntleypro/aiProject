const AWS = require('aws-sdk');
// const scanDynamoRecords = require('./scanDynamoRecords');
const util = require('../../utils/util');


AWS.config.update({
  region: 'us-east-1',
});


const dynamodb = new AWS.DynamoDB.DocumentClient();





async function getUsersForStore(tableName, user_ids) {
  const params = {
    TableName: tableName,
  };

  try {
    const allItems = await scanDynamoRecords(params, []);
    // Filter the items to include only those with IDs in user_ids
    const filteredItems = allItems // .filter((item) => user_ids.includes(item.id));
    return filteredItems;
  } catch (error) {
   return util.buildResponse(501, error );

  }
}


module.exports.geUsersForStore = getUsersForStore;


async function scanDynamoRecords(scanParams, itemArray) {
  try {
    const dynamoData = await dynamodb.scan(scanParams).promise();
    itemArray = itemArray.concat(dynamoData.Items);
    if (dynamoData.LastEvaluatedKey) {
      scanParams.ExclusiveStartKey = dynamoData.LastEvaluatedKey;
      return await scanDynamoRecords(scanParams, itemArray);
    }
    return itemArray;
  } catch (error) {
   return util.buildResponse(501, error );
  }
}
