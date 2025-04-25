const AWS = require('aws-sdk');
const util = require('../util');

AWS.config.update({
  region: 'us-east-1',
});


const dynamodb = new AWS.DynamoDB.DocumentClient();



// Function to save a user
async function saveUser(responseBody, tableName) {
  const userTable = tableName

  const params = {
    TableName: userTable,
    Item: responseBody,
  };

  try {
    await dynamodb.put(params).promise();
    return true;
  } catch (error) {
    // console.error('There is an error saving user: ', error);
    // return false;
    
    return util.buildResponse(500, ` Error finding user: ${error}`);
 
  }
}



module.exports.saveUser = saveUser;
