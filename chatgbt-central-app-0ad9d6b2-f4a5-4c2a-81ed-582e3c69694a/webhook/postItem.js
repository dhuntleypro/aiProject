const stripe = require('stripe')('sk_test_51NVCh3JEHBX7gOQAJsusxRMGshJMpITAzLcDwZvONm2yKmZmHXv8tk0zQRUjGqzvhaIW80Lfa8KVx4O4pSFjcfjU00VyJ6OsR1');
const util = require('../utils/util'); 

// app.post("/webhost", bodyParser.raw({ type: "application/json"}),




// )

// Create Payment Intent
// async function postItem(requestBody) {

//   try {
      
//     // const { paymentMethodType , currency } = requestBody
      
//     // const paymentIntent = await stripe.paymentIntents.create({
//     //     amount: 11999,
//     //     currency: currency,
//     //     payment_method_types: [paymentMethodType]
        
//     // //   payment_method_types: requestBody.paymentMethodType
//     //   //    after_expiration: requestBody.after_expiration,
//     // });
    

// //  
 
// // const client_secret = paymentIntent.client_secret;


  
   
//   const output = {
//     recieved: true,
   
//   }



//     return util.buildResponse(200, output);
//   } catch (e) {
//     console.error('Error:', e.message);
//     return util.buildResponse(400, { error: e.message });
//   }
// }

module.exports.postItem = postItem;