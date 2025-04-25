const AWS = require('aws-sdk');
// const mySnsArn = process.env.MY_CUSTOMER_SNS;
const util = require('../../utils/util');
 const stripe = require('stripe')('sk_test_51NVCh3JEHBX7gOQAJsusxRMGshJMpITAzLcDwZvONm2yKmZmHXv8tk0zQRUjGqzvhaIW80Lfa8KVx4O4pSFjcfjU00VyJ6OsR1');
// const stripe = require('stripe')('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');
const getUserData = require('../../utils/get/getUserData');
const getStoreData = require('../../utils/get/getStoreData');
 
async function accountInfo(email) {
    try {
         
         if (!email)  return util.buildResponse(400, "missing email " );

        // Fetch the user's data
        const userData = await getUserData.getUserData(email);
      //  return util.buildResponse(401, 'No User Data');
       //  return userData.Item.id
        if (!userData) return util.buildResponse(401, 'No User Data');
    
        // Fetch the store's data
        const storeData = await getStoreData.getStoreData(userData.Item.store_owner_id);
        if (!storeData) return util.buildResponse(403, 'No Store Data');
  
  
  
  

  
        // All Accounts
        
        if ( email == "legit2547@gmail.com" ) {
             const account = await stripe.accounts.retrieve(storeData.Item.stripe_id);
        // My Account - works to get my balance
        const availableBalance = await stripe.balance.retrieve(); 
         
        
          const body = {
            "id": "", 
             "balance": availableBalance.available[0].amount  / 100  ,
             //"pending": availableBalance.pending[0].amount  / 100  
        }
        
          return util.buildResponse(200, body );
          
          
        } else { // client
            
            
        const balance = await stripe.balance.retrieve({
           stripeAccount: storeData.Item.stripe_id,
         });
        
         const instantBalance = balance.instant_available[0].amount / 100

         
          const body = {
            "id": "",
             "balance" : instantBalance,
           // "availableBalance": availableBalance
        }
        
          return util.buildResponse(200, body );
          
        }
       
        
        
        // Get balance for cleint connect account
       //  const availableBalance =  (account.balance.available[0].amount) / 100
       // const availableBalance = account.balance ? (account.balance.available[0].amount) / 100 : 1;

        
         
        
        // const balance = await stripe.balance.retrieve({
        //   stripeAccount: storeData.Item.stripe_id,
        // });
        
        
       
         
        // const instantBalance = balance.instant_available[0].amount / 100
 
        // Instant balance
        const body = {
            "id": "",
            // "balance" : instantBalance,
            "availableBalance": availableBalance
        }
        
 
          //  return util.buildResponse(200, storeData.Item.stripe_id );
        return util.buildResponse(200, body );
        //  return util.buildResponse(200, debitCardId);

    } catch (error) {
        console.error("Error sending messages:", error);
        throw error;
    }
}

module.exports.accountInfo = accountInfo;
