const AWS = require('aws-sdk');
// const mySnsArn = process.env.MY_CUSTOMER_SNS;
const util = require('../../utils/util');
const sns = new AWS.SNS();

async function instantPayoutCustomer(responseBody, tableName) {
    try {
        
        
    
    
        return util.buildResponse(200, "fff");
    } catch (error) {
        console.error("Error sending messages:", error);
        throw error;
    }
}


module.exports.instantPayoutCustomer = instantPayoutCustomer;
