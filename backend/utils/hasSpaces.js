const AWS = require('aws-sdk');


AWS.config.update({
  region: 'us-east-1',
});



async function hasSpaces(inputString) {
    // Use a regular expression to search for spaces (whitespace) in the string
    const regex = /\s/;
    return regex.test(inputString);
}



module.exports.hasSpaces = hasSpaces;
