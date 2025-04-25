const AWS = require('aws-sdk');
const util = require('../../utils/util');

AWS.config.update({
  region: 'us-east-1',
});


const dynamodb = new AWS.DynamoDB.DocumentClient();



// Function to fetch user data
async function getOrderData(order_id) {
  const userTable = 'prof-website-order-table';

  const params = {
    TableName: userTable,
    Key: { id: order_id },
  };

  try {
    const data = await dynamodb.get(params).promise();
    return data;
  } catch (error) {
    console.error(`Error fetching user data:`, error);
    throw error;
 // return util.buildResponse(403, 'No Shippment Data');
  }
}


module.exports.getOrderData = getOrderData;
