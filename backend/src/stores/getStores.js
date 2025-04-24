const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();


exports.getStores = async () => {
    try {
      const params = {
        TableName: 'bot-shopping-stores-table',
      };
  
      const result = await dynamodb.scan(params).promise();
  
      return {
        statusCode: 200,
        body: JSON.stringify({ stores: result.Items }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: 'Error fetching stores',
          error: error.message,
        }),
      };
    }
  };
  