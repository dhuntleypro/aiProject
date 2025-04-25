const AWS = require('aws-sdk');
// const mySnsArn = process.env.MY_CUSTOMER_SNS;
const util = require('../../utils/util');
 const stripe = require('stripe')('sk_test_51NVCh3JEHBX7gOQAJsusxRMGshJMpITAzLcDwZvONm2yKmZmHXv8tk0zQRUjGqzvhaIW80Lfa8KVx4O4pSFjcfjU00VyJ6OsR1');
//const stripe = require('stripe')('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');
const getUserData = require('../../utils/get/getUserData');
const getStoreData = require('../../utils/get/getStoreData');

async function addDebitCard(responseBody, email) {
    try {
        
        
        // if (!responseBody.cardNumber) return util.buildResponse(401, 'No card-number');
        // if (!responseBody.expMonth) return util.buildResponse(401, 'No exp-month');
        // if (!responseBody.expYear) return util.buildResponse(401, 'No exp-year');
        // if (!responseBody.cvc) return util.buildResponse(401, 'No cvc');


        // // Fetch the user's data
        const userData = await getUserData.getUserData(email);
        if (!userData) return util.buildResponse(401, 'No User Data');
    
    
        // Fetch the store's data
        const storeData = await getStoreData.getStoreData(userData.Item.store_owner_id);
        if (!storeData) return util.buildResponse(407, 'No Store Data');
  
  
        // My Account - works to get my balance
        // const account = await stripe.accounts.retrieve(storeData.Item.stripe_id);
        // const balance = await stripe.balance.retrieve();
      
    
        // Attach the payment method to the connected account
        // await stripe.paymentMethods.attach(
        //     responseBody.paymentMethodId,
        //     { customer: storeData.Item.stripe_id } // Replace with your Stripe customer ID
        // );
        
        // Create a payment method with the card information
        // const paymentMethod = await stripe.paymentMethods.create({
        //     type: 'card',
        //     card: {
        //         number: cardNumber,
        //         exp_month: expMonth,
        //         exp_year: expYear,
        //         cvc: cvc,
        //     },
        // });

        // // Attach the payment method to the connected account
        // await stripe.paymentMethods.attach(
        //     paymentMethod.id,
        //     { customer: storeData.Item.stripe_customer_id }
        // );

        // Update the default payment method on the connected account
        // await stripe.accounts.update(storeData.Item.stripe_id, {
        //     default_payment_method: responseBody.paymentMethodId // paymentMethod.id,
        // });

      
        // // Retrieve the connected account's balance
        // const connectedAccount = await stripe.accounts.retrieve(storeData.Item.stripe_id);
        // const balance = await stripe.balance.retrieve({ stripeAccount: connectedAccount.id });


      
      
        // // Create a payment method with the card token
        // const paymentMethod = await stripe.paymentMethods.create({
        //     type: 'card',
        //     card: {
        //         token: cardToken,
        //     },
        // });

        // // Attach the payment method to the connected account
        // const attachedPaymentMethod = await stripe.paymentMethods.attach(
        //     paymentMethod.id,
        //     { customer: storeData.Item.stripe_customer_id } // Replace with the correct field for your connected account
        // );

        // // Update the default payment method on the connected account (optional)
        // await stripe.accounts.update(storeData.Item.stripe_connected_account_id, {
        //     default_payment_method: attachedPaymentMethod.id,
        // });
  
  
  
  
  
  
  
  
  
  
  
  

        
        // // instant_available
        // // inorder to have access to - yo ubeed a debit card connected
        
        
        
        
        
        
        
        // // Bank account - works
        // // const payout = await stripe.payouts.create({
        // //   amount: 5, // balance.available[0].amount,
        // //   currency: "USD",
        // //   method:   'standard', // instant - for debit cards
        // //   destination: "ba_1NVCrIJEHBX7gOQAv4ICuOxw", // stripe chase id (Bank account 2 days)
        // // });
        
    

        //  return util.buildResponse(200, "balance" );
          return util.buildResponse(200, "card added !" );
      //   return util.buildResponse(200, balance );
        //  return util.buildResponse(200, debitCardId);

    } catch (error) {
        console.error("Error sending messages:", error);
        throw error;
    }
}

module.exports.addDebitCard = addDebitCard;
