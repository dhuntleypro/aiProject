const AWS = require('aws-sdk');

AWS.config.update({
  region: 'us-east-1',
});


const dynamodb = new AWS.DynamoDB.DocumentClient();



// Function to fetch user data
async function getStoreData(store_id) {
  const userTable = 'prof-website-store-table';

  const params = {
    TableName: userTable,
    Key: { id: store_id },
  };

  try {
    const data = await dynamodb.get(params).promise();
    return data;
  } catch (error) {
    console.error(`Error fetching user data:`, error);
    throw error;
  }
}


module.exports.getStoreData = getStoreData;
