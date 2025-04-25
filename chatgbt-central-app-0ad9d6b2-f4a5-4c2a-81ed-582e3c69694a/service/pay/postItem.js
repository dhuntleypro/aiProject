
// const stripe = require('stripe')('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');
//const stripe = require('stripe')('sk_test_51NVCh3JEHBX7gOQAJsusxRMGshJMpITAzLcDwZvONm2yKmZmHXv8tk0zQRUjGqzvhaIW80Lfa8KVx4O4pSFjcfjU00VyJ6OsR1');
const util = require('../../utils/util'); 
const AWS = require('aws-sdk');
const getUserData = require('../../utils/get/getUserData');
const getStoreData = require('../../utils/get/getStoreData');


// Set your environment for Stripe (live or test)
const PaymentStatues =  "live"// "live"; // Change to "live" for production

// Dynamically select the Stripe API key based on PaymentStatues
const stripeApiKey = PaymentStatues === "live" 
    ? process.env.STRIPE_SERVER_LIVE_KEY 
    : process.env.STRIPE_SERVER_TEST_KEY;

// Initialize Stripe with the selected key
const stripe = require('stripe')(stripeApiKey);



AWS.config.update({
  region: 'us-east-1',
});

const dynamodb = new AWS.DynamoDB.DocumentClient();

// Main handler function for creating a payment intent
async function postItem(requestBody) {
  
  // Validate request data
  if (!requestBody)  return util.buildResponse(501, "Missing stripe_id.");
  if (!requestBody.stripe_id) return util.buildResponse(501, "Missing stripe_id.");
  if (!requestBody.amount) return util.buildResponse(504, "Missing amount.");

  try {
    // Differentiate between internal and client applications
    if (requestBody.stripe_id === "acct_1NVCh3JEHBX7gOQA") {
      // Handle internal application payment intent
      const paymentIntentResponse = await createSimplePaymentIntent(requestBody);
      return util.buildResponse(200, paymentIntentResponse);
    } else {
      // Handle client application payment intent
      const paymentIntentResponse = await createPaymentIntent(requestBody);
      return util.buildResponse(200, paymentIntentResponse);
    }
  } catch (error) {
    console.error('Error in postItem:', error.message);
    return util.buildResponse(500, { error: error.message });
  }
}

module.exports.postItem = postItem;

// Function to create a payment intent for client applications
async function createPaymentIntent(requestBody) {
  try {
    // Validate that stripe_id is present and non-empty
    if (!requestBody.stripe_id) return util.buildResponse(400, 'Store stripe_id is missing.');
    if (requestBody.stripe_id === '') return util.buildResponse(400, 'Store stripe_id is empty.');

    // Define amount and fees
    const minimumAmountCents = 50; // $0.50 in cents
    const shippingInCents = (requestBody.shipping_fee || 0) * 100;
    const amountInCents = requestBody.amount;

    // Calculate application fee (5.5% of the total amount)
    const feePercentage = 5.5;
    let applicationFee = Math.round((feePercentage / 100) * amountInCents) + shippingInCents;

    // Ensure application fee is at least the minimum amount
    if (applicationFee < minimumAmountCents) {
      applicationFee = minimumAmountCents;
      console.log("Application fee is less than $0.50. Setting it to $0.50.");
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: requestBody.currency,
      payment_method_types: [requestBody.paymentMethodType || 'card'],
      application_fee_amount: applicationFee,
      transfer_data: {
        destination: requestBody.stripe_id,
      },
      statement_descriptor: requestBody.app_name.slice(0, 22), // Max 22 chars
      description: `${amountInCents} -- `,
    });

    return { clientSecret: paymentIntent.client_secret };
  } catch (error) {
    console.error('Error in createPaymentIntent:', `${error.message} - check stripe_id`);
    throw error;
  }
}

// Function to create a simple payment intent for internal applications
async function createSimplePaymentIntent(requestBody) {
  const { paymentMethodType = 'card', currency = 'usd' } = requestBody;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: requestBody.amount,
      currency: currency,
      payment_method_types: [paymentMethodType]
    });

    return { clientSecret: paymentIntent.client_secret };
  } catch (error) {
    console.error('Error in createSimplePaymentIntent:', `${error.message} - check stripe_id`);
    throw error;
  }
}

