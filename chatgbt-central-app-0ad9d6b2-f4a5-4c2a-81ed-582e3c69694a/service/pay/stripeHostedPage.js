const stripe = require('stripe')('sk_test_51NVCh3JEHBX7gOQAJsusxRMGshJMpITAzLcDwZvONm2yKmZmHXv8tk0zQRUjGqzvhaIW80Lfa8KVx4O4pSFjcfjU00VyJ6OsR1');
// const stripe = require('stripe')('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');
const util = require('../../utils/util'); 
const AWS = require('aws-sdk');
const getUserData = require('../../utils/get/getUserData');
const getStoreData = require('../../utils/get/getStoreData');


AWS.config.update({
  region: 'us-east-1',
}); 

const dynamodb = new AWS.DynamoDB.DocumentClient();

const YOUR_DOMAIN = "https://appsformankind.com"

// Open a stripe hosted page for payments
async function stripeHostedPage(requestBody) {
  
  if (!requestBody.priceID) return util.buildResponse(400, "Missing price ID");
  
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price: requestBody.priceID, // '{{PRICE_ID}}',
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${YOUR_DOMAIN}?success=true`,
      cancel_url: `${YOUR_DOMAIN}?canceled=true`,
      automatic_tax: { enabled: true },
    });

    // Return a 200 status code for successful responses
    return util.buildResponse(200, { url: session.url });
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    // Return a 500 status code for server errors
    return util.buildResponse(500, { error: 'Internal Server Error', message: error.message });
  }
}

module.exports.stripeHostedPage = stripeHostedPage;
