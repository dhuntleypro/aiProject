const AWS = require('aws-sdk');
const util = require('../../utils/util');

AWS.config.update({
  region: 'us-east-1',
});

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function postItem(requestBody, tableName) {
  if (!requestBody) return util.buildResponse(322, 'Missing body');
  if (!tableName) return util.buildResponse(321, 'Missing table');

  // DynamoDB requires at least the partition key (like id)
  if (!requestBody.id) return util.buildResponse(400, 'Missing required id field');

  const params = {
    TableName: tableName,
    Item: requestBody,
  };

  console.log("📦 DynamoDB Put Params:", JSON.stringify(params, null, 2));

  try {
    await dynamodb.put(params).promise();
    const responseItem = { ...requestBody };

       // const body = {
      // Operation: 'SAVE',
      // Message: 'SUCCESS',
      // Item: responseItem,
      // };
    return util.buildResponse(200, responseItem);


    // return util.buildResponse(200, {
    //   Operation: 'SAVE',
    //   Message: 'SUCCESS',
    //   Item: requestBody,
    // });
  } catch (error) {
    console.error('❌ DynamoDB Put Error:', error);
    return util.buildResponse(503, { error: error.message });
  }
}

module.exports = postItem;



// const AWS = require('aws-sdk');
// const util = require('../../utils/util');

// AWS.config.update({
//   region: 'us-east-1',
// });

// // NOT BEING USED BY ORDERS


// const dynamodb = new AWS.DynamoDB.DocumentClient();

// async function postItem(requestBody, tableName) {
  
//     if (!requestBody) return util.buildResponse(322, 'Missing body');


//     if (!tableName) return util.buildResponse(321, 'Missing table');


//   const params = {
//     TableName: tableName,
//     Item: requestBody,
//   };

//   try {
//     await dynamodb.put(params).promise();

//     const responseItem = { ...requestBody };
    
//     const body = {
//       Operation: 'SAVE',
//       Message: 'SUCCESS',
//       Item: responseItem,
//     };
//     return util.buildResponse(200, body);
//     // return body

//   } catch (error) {
//     console.error('Error:', error);
//      return util.buildResponse(503, error);
//    // return util.buildResponse(503, "err");
//   }
// }


// module.exports = postItem;
