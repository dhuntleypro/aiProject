const AWS = require('aws-sdk');
const util = require('../util');


AWS.config.update({
  region: 'us-east-1',
});

const dynamodb = new AWS.DynamoDB.DocumentClient();


async function checkUserExistence(email) {
  const userTable =  'prof-website-user-table';
  
  const params = {
    TableName: userTable,
    Key: { email: email } 
  };

  try {
    const data = await dynamodb.get(params).promise();
    return !!data.Item;
  } catch (error) {
    // console.error(`Error checking existence in ${userTable}:`, error);
    // return false;
    return util.buildResponse(500, ` Error finding user: ${error}`);

  }
  
}


module.exports.checkUserExistence = checkUserExistence;


