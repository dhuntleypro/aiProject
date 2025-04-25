const AWS = require('aws-sdk');
const util = require('../util');


AWS.config.update({
  region: 'us-east-1',
});

const dynamodb = new AWS.DynamoDB.DocumentClient();


async function checkStoreExistence(store_id) {
  const params = {
    TableName: 'prof-website-store-table',
    Key: { id: store_id },
  };

  try {
    const data = await dynamodb.get(params).promise();
    return !!data.Item;
  } catch (error) {
    return util.buildResponse(500, ` Error finding store: ${error}`); // added to store

    // console.error(`Error checking existence in :`, error);
    // return false;
  }
}



module.exports.checkStoreExistence = checkStoreExistence;


