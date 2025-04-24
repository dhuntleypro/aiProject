const AWS = require('aws-sdk');
const util = require('../util');


AWS.config.update({
  region: 'us-east-1',
});

const dynamodb = new AWS.DynamoDB.DocumentClient();


// Function to check if store_ids are equal
function checkIfUserIsMemberOfStore(storeId1, storeId2) {
  if (!storeId1 || !storeId2) {
    return false;
  }
  if (Array.isArray(storeId1) && Array.isArray(storeId2)) {
    return JSON.stringify(storeId1.sort()) === JSON.stringify(storeId2.sort());
  }
  return storeId1 === storeId2;
}



module.exports.checkIfUserIsMemberOfStore = checkIfUserIsMemberOfStore;

