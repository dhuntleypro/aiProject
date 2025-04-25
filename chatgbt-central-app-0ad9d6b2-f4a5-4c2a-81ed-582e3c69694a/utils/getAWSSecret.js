const AWS = require('aws-sdk');
const util = require('./util');
const bcrypt = require('bcryptjs');

AWS.config.update({
  region: 'us-east-1',
});


const secretsManagerClient = new AWS.SecretsManager();

async function getAWSSecret() {
    const secretName = process.env.SECRET_NAME;

    const getSecretValueRequest = {
        SecretId: secretName,
    };

    try {
        const getSecretValueResponse = await secretsManagerClient.getSecretValue(getSecretValueRequest).promise();
        
        const secret = JSON.parse(getSecretValueResponse.SecretString);
        const apiKey = secret.APP_API_KEY;

        const response = {
            apiKey: apiKey
        };

        console.log(JSON.stringify(response, null, 2));
        return util.buildResponse(200, response);
    } catch (error) {
        console.error('Error fetching AWS secret:', error);
        return util.buildResponse(500, "Couldn't get it");
    }
}

module.exports = getAWSSecret;





// const AWS = require('aws-sdk');
// const util = require('./util');
// const bcrypt = require('bcryptjs');

// AWS.config.update({
//   region: 'us-east-1',
// });

// const secretsManagerClient = new AWS.SecretsManager();

// async function getAWSSecret(responseBody) { // request body not needed
//   const secretName = process.env.SECRET_NAME;

//   const getSecretValueRequest = {
//     SecretId: secretName,
//   };

//   try {
//     const getSecretValueResponse = await secretsManagerClient.getSecretValue(getSecretValueRequest).promise();

//     const secret = JSON.parse(getSecretValueResponse.SecretString);
//     const apiKey = secret[secretName]; 

//     const encryptedPW = bcrypt.hashSync(apiKey.trim(), 10);


//     let body = [
//       {
//           api_key : encryptedPW 
//       }  
//     ]
    
//     console.log(JSON.stringify({secretName : encryptedPW}, null, 2));
//     return util.buildResponse(200, body);
//   } catch (error) {
//     console.error('Error fetching AWS secret:', error);
//     return util.buildResponse(500, "Couldn't get it");
//   }
// }

// module.exports = getAWSSecret;


// const AWS = require('aws-sdk');
// const util = require('./util'); // Import your util module
// const bcrypt = require('bcryptjs');

// AWS.config.update({
//   region: 'us-east-1',
// });

// const secretsManagerClient = new AWS.SecretsManager();

// async function getAWSSecret(responseBody) {
//   const getSecretValueRequest = {
//     SecretId: responseBody.secretName,
//   };

//   try {
//     const getSecretValueResponse = await secretsManagerClient.getSecretValue(getSecretValueRequest).promise();
    
//     const secret = JSON.parse(getSecretValueResponse.SecretString);
//     const apiKey = secret.APP_API_KEY; // Assuming apiKey is the property containing your API key
    
//     const encryptedPW = bcrypt.hashSync(apiKey.trim(), 10); // Adjust the number of rounds as needed

//     console.log(JSON.stringify(encryptedPW, null, 2));
//     return util.buildResponse(200, encryptedPW);
//   } catch (error) {
//     console.error('Error fetching AWS secret:', error);
//     return util.buildResponse(500, "Couldn't get it");
//   }
// }

// module.exports = getAWSSecret;