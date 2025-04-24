const AWS = require('aws-sdk');
const util = require('./util');


AWS.config.update({
  region: 'us-east-1',
});



function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    result += characters.charAt(randomIndex);
  }

  return result;
}


module.exports.generateRandomString = generateRandomString;
