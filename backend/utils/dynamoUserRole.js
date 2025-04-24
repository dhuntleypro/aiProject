const AWS = require('aws-sdk');
const util = require('./util');
const bcrypt = require('bcryptjs');
const dynamodb = new AWS.DynamoDB.DocumentClient();

AWS.config.update({
  region: 'us-east-1',
});

async function dynamoUserRole(responseBody, tableName) {
  try {
    // Get the user from DynamoDB
    const dynamoUser = await getUser(responseBody.email, tableName);

    if (!dynamoUser) {
      return util.buildResponse(403, { message: 'User not found' });
    }

    if (!bcrypt.compareSync(responseBody.password, dynamoUser.password)) {
      return util.buildResponse(403, { message: 'Password is incorrect' });
    }

    return dynamoUser;
  } catch (error) {
    console.error('Error:', error);
    return util.buildResponse(500, { message: 'Internal server error' });
  }
}

async function getUser(email, tableName) {
  const params = {
    TableName: tableName,
    Key: {
      email: email.toLowerCase().trim(),
    },
  };

  return await dynamodb
    .get(params)
    .promise()
    .then(
      (response) => {
        return response.Item;
      },
      (error) => {
        console.error('There is an error: ', error);
        throw error;
      }
    );
}

module.exports = dynamoUserRole;


// const AWS = require('aws-sdk');
// const util = require('./util');
// const bcrypt = require('bcryptjs');
// const dynamodb = new AWS.DynamoDB.DocumentClient();

// AWS.config.update({
//   region: 'us-east-1',
// });



// async function dynamoUserRole(responseBody, tableName) {

//     // Dynamo Access
//     //  const userRole = await getUserRoleFromDynamoDB(event.userId); // Replace with actual retrieval logic
//     const dynamoUser = await getUser(
//         responseBody.id,
//         tableName
//       //  responseBody.email.toLowerCase().trim(), 
//     //   responseBody.role
//     );
  
//     if (!dynamoUser) {
//       return util.buildResponse(403, { message: responseBody.email + ': object error - user email case sensitive or check identifier (dynamodb)' });
//     }
  
//     if (!dynamoUser.email) {
//       return util.buildResponse(403, { message: 'user email does not exist' });
//     }
  
//     if (!bcrypt.compareSync(responseBody.password, dynamoUser.password)) {
//       return util.buildResponse(403, { message: 'password is incorrect' });
//     }
    
//     return dynamoUser
  
//   //  const userInfo = { ...dynamoUser };


// }




// async function getUser(responseBody) {
//   const userTable = responseBody.tableName
//   const params = {
//     TableName: userTable,
//     Key: {
//       email: responseBody.email,
//     },
//   };

//   return await dynamodb
//     .get(params)
//     .promise()
//     .then(
//       (response) => {
//         return response.Item;
//       },
//       (error) => {
//         console.error('There is an error: ', error);
//       }
//     );
// }


// module.exports = dynamoUserRole;
