const AWS = require('aws-sdk');

AWS.config.update({
  region: 'us-east-1',
});


const dynamodb = new AWS.DynamoDB.DocumentClient();




// Function to fetch user data
async function getUserData(email) {
  const userTable = 'prof-website-user-table';

  const params = {
    TableName: userTable,
    Key: { email: email },
  };

  try {
    const data = await dynamodb.get(params).promise();
    return data; // Item
  } catch (error) {
    console.error(`Error fetching user data:`, error);
    throw error;
  }
}


module.exports.getUserData = getUserData;
