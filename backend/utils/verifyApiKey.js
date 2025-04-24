const AWS = require('aws-sdk');
const util = require('./util');
const bcrypt = require('bcryptjs');

AWS.config.update({
  region: 'us-east-1',
});

const secretsManagerClient = new AWS.SecretsManager();

// Lambda function to verify API key
async function verifyApiKey(event, context) {
    const secretName = process.env.SECRET_NAME; // Change this to the actual secret name
    const apiKeyQueryParam = event.queryStringParameters.apiKey; // Extract the hashed API key from the query parameters

    const getSecretValueRequest = {
        SecretId: secretName,
    };

    try {
        const getSecretValueResponse = await secretsManagerClient.getSecretValue(getSecretValueRequest).promise();
        const secret = JSON.parse(getSecretValueResponse.SecretString);
        const storedApiKey = secret[secretName]; // Retrieve the stored hashed API key from the secret

        // Compare the provided hashed API key with the stored hashed API key
        if (bcrypt.compareSync(apiKeyQueryParam, storedApiKey)) {
            return util.buildResponse(200, { message: 'API key verification successful' });
        } else {
            return util.buildResponse(403, { message: 'API key verification failed' });
        }
    } catch (error) {
        console.error('Error fetching AWS secret:', error);
        return util.buildResponse(500, "Couldn't get it");
    }
}

module.exports = verifyApiKey;
