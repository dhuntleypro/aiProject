const AWS = require('aws-sdk');


AWS.config.update({
  region: 'us-east-1',
});

const dynamodb = new AWS.DynamoDB.DocumentClient();


// // 
async function validatePassword(password) {
  // Use a regular expression to define the password pattern
const passwordPattern = /^(?=.*[^a-zA-Z0-9])(?=.*[A-Z])(?=.*\d).+$/;

  // Test if the password matches the pattern
  return passwordPattern.test(password);
}




module.exports.validatePassword = validatePassword;


