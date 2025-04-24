const AWS = require('aws-sdk');
const util = require('../../utils/util');

AWS.config.update({
  region: 'us-east-1',
});


// Format
// {
//     "id": "p3",
//     "tableName": "prof-website-product-table",
//     "updateKey":  "on_sale",
//     "updateValue": true
// }



const dynamodb = new AWS.DynamoDB.DocumentClient();

async function patchItem(responseBody) {
  const params = {
    TableName: responseBody.tableName,
    Key: {
      id: responseBody.id,
    },
    UpdateExpression: `set ${responseBody.updateKey} = :value`,
    ExpressionAttributeValues: {
      ':value': responseBody.updateValue,
    },
    returnValues: 'UPDATED_NEW',
  };
  return await dynamodb
    .update(params)
    .promise()
    .then(
      (response) => {
        const body = {
          Operation: 'UPDATE',
          Message: 'SUCCESS',
          Item: response,
        };
        return util.buildResponse(200, body);
      },
      (error) => {
        console.error('Do your thing....');
        return util.buildResponse(500, error);
      }
    );
}

module.exports = patchItem;