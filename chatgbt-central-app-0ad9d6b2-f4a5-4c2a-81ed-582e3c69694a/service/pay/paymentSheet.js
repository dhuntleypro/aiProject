const util = require('../../utils/util');
const AWS = require('aws-sdk');

// Set your environment for Stripe (live or test)
const PaymentStatues = "test"// "live"; // Change to "live" for production

// Dynamically select the Stripe API key based on PaymentStatues
const stripeApiKey = PaymentStatues === "live" 
    ? process.env.STRIPE_SERVER_LIVE_KEY 
    : process.env.STRIPE_SERVER_TEST_KEY;

// Dynamically select the Stripe Publishable key based on PaymentStatues
const stripePublishableApiKey = PaymentStatues === "live" 
    ? process.env.STRIPE_PUBLISHABLE_LIVE_KEY 
    : process.env.STRIPE_PUBLISHABLE_TEST_KEY;

// Initialize Stripe with the selected key
const stripe = require('stripe')(stripeApiKey);

AWS.config.update({
  region: 'us-east-1',
});

const dynamodb = new AWS.DynamoDB.DocumentClient();

const OWN_STRIPE_ACCOUNT_ID = "acct_1NVCh3JEHBX7gOQA"; // Replace with your actual account ID

// Main handler function for creating a payment intent
async function paymentSheet(requestBody) {
  if (!requestBody) return util.buildResponse(501, "Request body is missing.");

  // Validate request data
  if (!requestBody.stripe_id) return util.buildResponse(501, "Missing stripe_id.");
  if (!requestBody.amount) return util.buildResponse(504, "Missing amount.");

  try {
    // Create a new customer for the payment
    const customer = await stripe.customers.create();

    // Create an ephemeral key for the customer
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: '2022-11-15' }
    );

    // Calculate the 5% application fee and the final amount to charge
    const amountInCents = requestBody.amount;
    const feePercentage = 5;
    const applicationFeeAmount = Math.round((feePercentage / 100) * amountInCents);

    // Build payment intent parameters
    let paymentIntentParams = {
      amount: amountInCents,
      currency: requestBody.currency || 'usd',
      customer: customer.id,
      automatic_payment_methods: { enabled: true },
    };

    // Add transfer_data and application_fee_amount only if using a connected account
    if (requestBody.stripe_id !== OWN_STRIPE_ACCOUNT_ID) {
      paymentIntentParams.transfer_data = { destination: requestBody.stripe_id };
      paymentIntentParams.application_fee_amount = applicationFeeAmount; // 5% fee to platform account
    } else {
      console.warn("Transfer to your own account is not allowed. Omitting 'transfer_data' and 'application_fee_amount'.");
    }

    const paymentIntent = await stripe.paymentIntents.create(paymentIntentParams);

    // Build a successful response with client secrets and customer information
    return util.buildResponse(200, {
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
      publishableKey: stripePublishableApiKey,
    });
  } catch (error) {
    console.error('Error in paymentSheet:', error.message);

    if (error.type === 'StripeInvalidRequestError') {
      return util.buildResponse(400, { error: `Invalid request parameters - ${error.message}` });
    } else if (error.type === 'StripeCardError') {
      return util.buildResponse(402, { error: "Card declined" });
    } else {
      return util.buildResponse(500, { error: "An unexpected error occurred. Please try again later." });
    }
  }
}

module.exports.paymentSheet = paymentSheet;


// works but doesnt transfer on other stripe ids
// // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// // const stripe = require('stripe')('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');
// // const stripe = require('stripe')('sk_test_51NVCh3JEHBX7gOQAJsusxRMGshJMpITAzLcDwZvONm2yKmZmHXv8tk0zQRUjGqzvhaIW80Lfa8KVx4O4pSFjcfjU00VyJ6OsR1');
// const util = require('../../utils/util'); 
// const AWS = require('aws-sdk');
// const getUserData = require('../../utils/get/getUserData');
// const getStoreData = require('../../utils/get/getStoreData');


// // Set your environment for Stripe (live or test)
// const PaymentStatues = "live"; // Change to "live" for production

// // Dynamically select the Stripe API key based on PaymentStatues
// const stripeApiKey = PaymentStatues === "live" 
//     ? process.env.STRIPE_SERVER_LIVE_KEY 
//     : process.env.STRIPE_SERVER_TEST_KEY;

// // Dynamically select the Stripe Publishable key based on PaymentStatues
// const stripePublishableApiKey = PaymentStatues === "live" 
//     ? process.env.STRIPE_PUBLISHABLE_LIVE_KEY 
//     : process.env.STRIPE_PUBLISHABLE_TEST_KEY;

// // Initialize Stripe with the selected key
// const stripe = require('stripe')(stripeApiKey);





// AWS.config.update({
//   region: 'us-east-1',
// });

// const dynamodb = new AWS.DynamoDB.DocumentClient();

// // Main handler function for creating a payment intent
// async function paymentSheet(requestBody) {
//   if (!requestBody) return util.buildResponse(501, "Request body is missing.");
  
//   // Validate request data
//   if (!requestBody.stripe_id) return util.buildResponse(501, "Missing stripe_id.");
//   if (!requestBody.amount) return util.buildResponse(504, "Missing amount.");

//   try {
//     // Use an existing Customer ID if this is a returning customer.
//     const customer = await stripe.customers.create();

//     const ephemeralKey = await stripe.ephemeralKeys.create(
//       { customer: customer.id },
//       { apiVersion: '2022-11-15' }
//     );

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: requestBody.amount,
//       currency: 'eur',
//       customer: customer.id,
//       automatic_payment_methods: {
//         enabled: true,
//       },
//     });

//     // Build a successful response with client secrets and customer information
//     return util.buildResponse(200, {
//       paymentIntent: paymentIntent.client_secret,
//       ephemeralKey: ephemeralKey.secret,
//       customer: customer.id,
//       publishableKey: stripePublishableApiKey // process.env.STRIPE_PUBLISHABLE_TEST_KEY,
//     });
//   } catch (error) {
//     console.error('Error in paymentSheet:', error.message);
//     return util.buildResponse(500, { error: error.message });
//   }
// }

// module.exports.paymentSheet = paymentSheet;
