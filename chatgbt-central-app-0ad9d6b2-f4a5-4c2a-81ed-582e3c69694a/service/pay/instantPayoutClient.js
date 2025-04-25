const AWS = require('aws-sdk');
// const mySnsArn = process.env.MY_CUSTOMER_SNS;
const util = require('../../utils/util');
 const stripe = require('stripe')('sk_test_51NVCh3JEHBX7gOQAJsusxRMGshJMpITAzLcDwZvONm2yKmZmHXv8tk0zQRUjGqzvhaIW80Lfa8KVx4O4pSFjcfjU00VyJ6OsR1');
//const stripe = require('stripe')('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');
const getUserData = require('../../utils/get/getUserData');
const getStoreData = require('../../utils/get/getStoreData');

async function instantPayoutClient(email, speedType) {
    try {
        

        // Fetch the user's data
        const userData = await getUserData.getUserData(email);
        if (!userData) return util.buildResponse(401, 'No User Data');
    
        // Fetch the store's data
        const storeData = await getStoreData.getStoreData(userData.Item.store_owner_id);
        if (!storeData) return util.buildResponse(403, 'No Store Data');
  
  
  
        // 
        if ( speedType == "instant") {
           
            // Retrieve the connected account's balance
                const connectedAccount = await stripe.accounts.retrieve(storeData.Item.stripe_id);
                const balance = await stripe.balance.retrieve({ stripeAccount: connectedAccount.id });
                const availableBalance =  balance.available[0].amount
                const instantBalance =  balance.instant_available[0].amount

                  
                // Bank account - works
                // const payout = await stripe.payouts.create({
                //   amount: 5, // balance.available[0].amount,
                //   currency: "USD",
                //   method:   'standard', // instant - for debit cards
                //   destination: "ba_1NVCrIJEHBX7gOQAv4ICuOxw", // stripe chase id (Bank account 2 days)
                // });
                
                const body = {
                    balance: availableBalance,
                    instant: instantBalance
                }
                
               return util.buildResponse(200, body );

      
        } else  if ( speedType == "wait") {
              // Wait
            
             if (email == "dhuntleypro@gmail.com") {
                // My Account - works to get my balance
                const account = await stripe.accounts.retrieve(storeData.Item.stripe_id);
                const balance = await stripe.balance.retrieve();
                const availableBalance =  balance.available[0].amount
                 
                           
                // Bank account - works
                // const payout = await stripe.payouts.create({
                //   amount: 5, // balance.available[0].amount,
                //   currency: "USD",
                //   method:   'standard', // instant - for debit cards
                //   destination: "ba_1NVCrIJEHBX7gOQAv4ICuOxw", // stripe chase id (Bank account 2 days)
                // });
                
                
                
 

                return util.buildResponse(200, availableBalance );

                
             } else {
                 // CLIENT
                 
                // Retrieve the connected account's balance
                const connectedAccount = await stripe.accounts.retrieve(storeData.Item.stripe_id);
                const balance = await stripe.balance.retrieve({ stripeAccount: connectedAccount.id });
                const availableBalance =  balance.available[0].amount
                const instantBalance =  balance.instant_available[0].amount

                  
                // Bank account - works
                // const payout = await stripe.payouts.create({
                //   amount: 5, // balance.available[0].amount,
                //   currency: "USD",
                //   method:   'standard', // instant - for debit cards
                //   destination: "ba_1NVCrIJEHBX7gOQAv4ICuOxw", // stripe chase id (Bank account 2 days)
                // });
                
                const body = {
                    balance: availableBalance,
                    instant: instantBalance
                }
                
               return util.buildResponse(200, body );


             }
        }
  
  
  
  
  
  
  
  
  
  
  
       

    } catch (error) {
        console.error("Error sending messages:", error);
        throw error;
    }
}

module.exports.instantPayoutClient = instantPayoutClient;
