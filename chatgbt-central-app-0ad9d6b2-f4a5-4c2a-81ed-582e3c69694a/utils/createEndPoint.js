const AWS = require('aws-sdk');
AWS.config.update({
  region: process.env.REGION_NAME,
});
const util = require('../utils/util');
// const bcrypt = require('bcryptjs');

// const dynamodb = new AWS.DynamoDB.DocumentClient();
const dynamodb = new AWS.DynamoDB();



async function create(requestBody) {
  try {
  // const params = {
  //   TableName: requestBody.table_name,
  //   Key: {
  //     id: "id",
  //   },
  //   ReturnValues: 'ALL_OLD',
  // };
    const params = {
            // TableName: requestBody.table_name,
            // KeySchema: [
            //     { AttributeName: 'id', KeyType: 'HASH' } // Primary key
            // ],
            // AttributeDefinitions: [
            //     { AttributeName: 'id', AttributeType: 'S' } // Attribute type can be 'S' for string, 'N' for number, etc.
            // ],
            // ProvisionedThroughput: {
            //     ReadCapacityUnits: 5, // Adjust these values as per your needs
            //     WriteCapacityUnits: 5
            // },
            
                      // {
            TableName: "GameScores",
            AttributeDefinitions: [
              {
                AttributeName: "id",
                AttributeType: "S"
              },
              {
                AttributeName: "GameTitle",
                AttributeType: "S"
              }
            ],
            KeySchema: [
              {
                AttributeName: "UserId",
                KeyType: "HASH"
              },
              {
                AttributeName: "GameTitle",
                KeyType: "RANGE"
              }
            ],
            ProvisionedThroughput: {
              ReadCapacityUnits: "10",
              WriteCapacityUnits: "5"
            },
            // StreamSpecification: {
            //   StreamEnabled: true,
            //   StreamViewType: "KEYS_ONLY"
            // }
         // }

        };
        
    const result = await dynamodb.createTable(params).promise();
    console.log('Table creation result:', result);



    // Return the response to the client
    return util.buildResponse(200, result);
  } catch (error) {
    console.error('Error creating account link:', error);
    // Log the full error object for debugging purposes
    console.error(error);
    // Return a more specific error message to the client
    return util.buildResponse(500, { error: error.message });
  }
}

module.exports.create = create;