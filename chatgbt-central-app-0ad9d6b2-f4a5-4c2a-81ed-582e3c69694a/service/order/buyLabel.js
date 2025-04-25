const AWS = require('aws-sdk');
const shippo = require('shippo')('shippo_test_df99f9feed92d9ec3cd58200d1e72d4cb9bbd3f9');
// const shippo = require('shippo')('shippo_live_0c7c02b50e9f3c3d039b74173971828085172f21');
const util = require('../../utils/util');
const getUserData = require('../../utils/get/getUserData');
const getOrderData = require('../../utils/get/getOrderData');
const getStoreData = require('../../utils/get/getStoreData');

AWS.config.update({
  region: 'us-east-1',
});

// https://docs.goshippo.com/docs/guides_general/generate_shipping_label/#create-a-label-with-two-api-calls


const dynamodb = new AWS.DynamoDB.DocumentClient();
const shippoItems = []
const s3 = new AWS.S3();



async function buyLabel(order_id, store_id, tableName) {
  try {
    // Fetch the order data
    const orderData = await getOrderData.getOrderData(order_id);
    if (!orderData) return util.buildResponse(403, 'No Order Data');

    // Fetch the store's data
    const storeData = await getStoreData.getStoreData(store_id);
    if (!storeData) return util.buildResponse(403, 'No Store Data');

    const order = orderData.Item;
    const store = storeData.Item;

    
    const addressFrom  = {
        "name": order.from_address.name,
        "street1": order.from_address.streetOne,
        "city": order.from_address.city,
        "state": order.from_address.state,
        "zip": order.from_address.zip,
        "country": "US"
    };
    
    const addressTo = {
        "name": order.to_address.name,
        "street1": order.to_address.streetOne,
        "city": order.to_address.city,
        "state": order.to_address.state,
        "zip": order.to_address.zip,
        "country": "US"
    };
    
    
     
  const parcel = {
    length: "5.0000",     // shippoItem.length,
    width: "5.0000",      // shippoItem.width,
    height: "5.0000",     // shippoItem.height,
    distance_unit: "in",  // shippoItem.distance_unit,
    weight: "1.0000",     // shippoItem.weight,
    mass_unit: "lb",      // shippoItem.mass_unit,
    value_amount: 0,   // shippoItem.value_amount,
    metadata: "",         // shippoItem.metadata,
    test: true          // shippoItem.test,
  }
  
  
   const shipping = await shippo.shipment.create({
        "address_from": addressFrom,
        "address_to": addressTo,
        "parcels": [parcel],
        "async": false
    })
    if (!shipping) return util.buildResponse(403, 'No shipping Data');



    // Transation
    var rate = shipping.rates[0];
    
    // Purchase the desired rate.
   const transaction = await shippo.transaction.create({
        "rate": rate.object_id,
        "label_file_type": "PDF",
        "async": false
    })
    if (!transaction) return util.buildResponse(403, 'No transaction Data');


    // Update order shipping_label
    await updateShippingLabel(order_id, transaction.label_url)





    // return util.buildResponse(200, {"Shipping label created successfully": transaction.tracking_url_provider});
    return util.buildResponse(200, {"Shipping label created successfully": transaction});
    // return util.buildResponse(200, {"Shipping label created successfully": transaction.label_url});
    // return util.buildResponse(200, {"Shipping label created successfully": transaction.tracking_number});
    // return util.buildResponse(200, {"Shipping label created successfully": transaction.qr_code_url});
    // return util.buildResponse(200, {"Shipping label created successfully": transaction});
  } catch (error) {
    console.error('Error creating shipment:', error);
    // Handle the shipment creation error
    return util.buildResponse(500, `Error creating shipment: ${error}`);
  }
}

module.exports = buyLabel;

  
async function updateShippingLabel(orderId, labelKey) {
  try {
    // Update DynamoDB record with the shipping label information
    const updateParams = {
      TableName: "prof-website-order-table",
      Key: {
        id: orderId,
      },
      UpdateExpression: 'SET shipping_label = :label',
      ExpressionAttributeValues: {
        ':label': labelKey,
      },
      ReturnValues: 'ALL_NEW', // Change if you want a different return value
    };

    const updatedRecord = await dynamodb.update(updateParams).promise();

    console.log('DynamoDB record updated successfully:', updatedRecord);

    return util.buildResponse(200, 'DynamoDB record updated successfully');
  } catch (error) {
    console.error('Error updating DynamoDB record:', error);
    return util.buildResponse(500, `Error updating DynamoDB record: ${error}`);
  }
}













//     const from_address = {
//       name: store.store_name,
//       street1: store.store_address,
//       city: store.store_address_city,
//       state: store.store_address_state,
//       zip: store.store_address_zip,
//       country: 'US',
//       phone: '+1 555-1234', // store.phone_number, //
//       email: store.email,
//       is_residential: false,
//     };

//     const to_address = {
//       name: order.to_address.name,
//       street1: order.to_address.streetOne,
//       city: order.to_address.city,
//       state: order.to_address.state,
//       zip: order.to_address.zip,
//       country: 'US',
//       phone: order.to_address.phone,
//       email: order.to_address.email,
//       is_residential: true,
//     };

//     // Base parcel data
//     const baseParcel = {
//       length: '5.0000',
//       width: '5.0000',
//       height: '5.0000',
//       distance_unit: 'in',
//       weight: '1.0000',
//       mass_unit: 'lb',
//       value_amount: 8.90,
//       metadata: '',
//       test: true,
//     };

// const shippingData = {
//   shipment: {
//     "address_from": from_address,
//     "address_to": to_address,
//     "parcels": [baseParcel],
//   },
// };

    // Create a shipment and get the label from Shippo
    // const shipment = await shippo.transaction.create(shippingData);

    // Save the label to S3 or perform further actions
    // const labelKey = `labels/${Date.now()}_label.pdf`; // Customize the label key
    // const labelParams = {
    //   Bucket,
    //   Key: labelKey,
    //   Body: shipment.label_url,
    //   ContentType: 'application/pdf',
    // };
    // await s3.putObject(labelParams).promise();

    // console.log('Shipping label created successfully:', labelKey);

    // Use created parcels to create a shipment (commented out)
    // const shipment = await shippo.shipment.create({
    //   from_address: from_address,
    //   to_address: to_address,
    //   parcels: baseParcel,
    // })

    // Return a success response

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
// async function buyLabel(order_id, store_id, tableName) {


//   try {
//     // Fetch the order data
//     const orderData = await getOrderData.getOrderData(order_id);
//     if (!orderData) return util.buildResponse(403, 'No Order Data');

//     // Fetch the store's data
//     const storeData = await getStoreData.getStoreData(store_id);
//     if (!storeData) return util.buildResponse(403, 'No Store Data');
 
  
//     const order = orderData.Item
//     const store = storeData.Item ;
    
   
//     const from_address = {
//       "name": store.store_name,
//       "street1":  store.store_address,
//       "city":  store.store_address_city,
//       "state": store.store_address_state,
//       "zip":  store.store_address_zip,
//       "country": "US",
//       "phone": "+1 555-1234", //  store.phone_number, //
//       "email": store.email,
//       "is_residential": false
//     };
     
     
//     const to_address = {
//       "name": order.to_address.name,
//       "street1": order.to_address.streetOne,
//       "city":  order.to_address.city,
//       "state":  order.to_address.state,
//       "zip":  order.to_address.zip,
//       "country": "US",
//       "phone": order.to_address.phone,
//       "email":  order.to_address.email,
//       "is_residential": true
//     };
     
 
//   const baseParcel = {
//     length: "5.0000",     // shippoItem.length,
//     width: "5.0000",      // shippoItem.width,
//     height: "5.0000",     // shippoItem.height,
//     distance_unit: "in",  // shippoItem.distance_unit,
//     weight: "1.0000",     // shippoItem.weight,
//     mass_unit: "lb",      // shippoItem.mass_unit,
//     value_amount: 8.90,   // shippoItem.value_amount,
//     // value_currency: "",
//     metadata: "",         // shippoItem.metadata,
//     test: true          // shippoItem.test,
//   }
  
// // Retrieve data from S3 bucket
//     const { Bucket, Key } = event.Records[0].s3;
//     const params = { Bucket, Key };
//     const s3Object = await s3.getObject(params).promise();
//     const shippingData = JSON.parse(s3Object.Body.toString());

//     // Create a shipment and get the label from Shippo
//     const shipment = await shippo.transaction.create(shippingData);

//     // Save the label to S3 or perform further actions
//     const labelKey = `labels/${Date.now()}_label.pdf`; // Customize the label key
//     const labelParams = {
//       Bucket,
//       Key: labelKey,
//       Body: shipment.label_url,
//       ContentType: 'application/pdf',
//     };
//     await s3.putObject(labelParams).promise();

//     console.log('Shipping label created successfully:', labelKey);

//     // Use created parcels to create a shipment
//     // const shipment = await shippo.shipment.create({
//     //   from_address: from_address,
//     //   to_address: to_address,
//     //   parcels: baseParcel,
//     // })

//   // return util.buildResponse(200, shippingBody);
    

    
    
//   } catch (error) {
//     console.error('Error creating shipment:', error);
//     // Handle the shipment creation error
//     return util.buildResponse(500, `Error creating shipment: ${error}`);
//   }
// }

// module.exports = buyLabel;







// const shippingBody = {
//     from_address: {
//           "name": order.from_address.name,
//           "street1": order.from_address.streetOne,
//           "city":  order.from_address.city,
//           "state": order.from_address.state,
//           "zip": order.from_address.zip,
//           "country": "US",
//           "phone": order.from_address.phone,
//           "email":  order.from_address.email,
//           "is_residential": true
//         },
//         to_address: {
//           "name": order.to_address.name,
//           "street1": order.to_address.streetOne,
//           "city":  order.to_address.city,
//           "state": order.to_address.state,
//           "zip": order.to_address.zip,
//           "country": "US",
//           "phone": order.to_address.phone,
//           "email":  order.to_address.email,
//           "is_residential": true
//         },
//         // address_return: createdReturnAddress.object_id, // Include the return address
//         // return_address:  {
//         //   "name": order.from_address.name,
//         //   "street1": order.from_address.streetOne,
//         //   "city":  order.from_address.city,
//         //   "state": order.from_address.state,
//         //   "zip": order.from_address.zip,
//         //   "country": "US",
//         //   "phone": order.from_address.phone,
//         //   "email":  order.from_address.email,
//         //   "is_residential": true
//         // },

//         parcel:  [{
//           length: order.parcel.length,
//           width:  order.parcel.width,
//           height:  order.parcel.height,
//           distance_unit:  order.parcel.distance_unit,
//           weight:  order.parcel.weight,
//           mass_unit:  order.parcel.mass_unit,
//           value_amount:  order.parcel.value_amount,
//           metadata:  order.parcel.metadata,
//           test: order.parcel.test,
//           async: false
//         }]
// }




















// const AWS = require('aws-sdk');
// const shippo = require('shippo')('shippo_test_df99f9feed92d9ec3cd58200d1e72d4cb9bbd3f9');
// // const shippo = require('shippo')('shippo_live_0c7c02b50e9f3c3d039b74173971828085172f21');
// const util = require('../../utils/util');
// const getUserData = require('../../utils/get/getUserData');
// const getOrderData = require('../../utils/get/getOrderData');
// const getStoreData = require('../../utils/get/getStoreData');

// AWS.config.update({
//   region: 'us-east-1',
// });

// const dynamodb = new AWS.DynamoDB.DocumentClient();
// const shippoItems = []
  
// async function buyLabel(order_id, tableName) {
//   // const params = {
//   //   TableName: tableName,
//   //   Item: requestBody,
//   // };

//   // const parcel = {
//   //   length: "5.0000",
//   //   width: "5.0000",
//   //   height: "5.0000",
//   //   distance_unit: "in",
//   //   weight: "1.0000",
//   //   mass_unit: "lb",
//   //   value_amount: null,
//   //   value_currency: null,
//   //   metadata: "",
//   //   test: true
//   // };

//   try {
//     // Fetch the order data
//     const orderData = await getOrderData.getOrderData(order_id);
//     if (!orderData) return util.buildResponse(403, 'No Order Data');

// const order = orderData.Item



// const shippingBody = {
//     from_address: {
//           "name": order.from_address.name,
//           "street1": order.from_address.streetOne,
//           "city":  order.from_address.city,
//           "state": order.from_address.state,
//           "zip": order.from_address.zip,
//           "country": "US",
//           "phone": order.from_address.phone,
//           "email":  order.from_address.email,
//           "is_residential": true
//         },
//         to_address: {
//           "name": order.to_address.name,
//           "street1": order.to_address.streetOne,
//           "city":  order.to_address.city,
//           "state": order.to_address.state,
//           "zip": order.to_address.zip,
//           "country": "US",
//           "phone": order.to_address.phone,
//           "email":  order.to_address.email,
//           "is_residential": true
//         },
//         parcel:  [{
//           length: order.parcel.length,
//           width:  order.parcel.width,
//           height:  order.parcel.height,
//           distance_unit:  order.parcel.distance_unit,
//           weight:  order.parcel.weight,
//           mass_unit:  order.parcel.mass_unit,
//           value_amount:  order.parcel.value_amount,
//           metadata:  order.parcel.metadata,
//           test: order.parcel.test,
//           async: false
//         }]
// }


//     // Use created parcels to create a shipment
//     const shipment = await shippo.shipment.create(shippingBody)
//       // address_from: orderData.Item.from_address,
//       // address_to: orderData.Item.to_address,
//       // parcels: [orderData.Item.parcel],
     
    

//     // if (!shipment) {
//     //   console.error('Error creating shipment. No shipment data received.');
//     //   return util.buildResponse(500, 'Error creating shipment. No shipment data received.');
//     // }

//     // Log the shipment details for debugging
//   // console.log('Shipment created successfully:', shipment);

//     // Get the first rate for the shipment
//     // const rate = shipment.rates[0];



//   // error....
 
//   // Create a transaction for the selected rate
// // const transaction = await shippo.transaction.create({
// //   shipment: shipment.object_id,
// //   rate: rate.object_id,
// //   label_file_type: 'PDF',
// //   async: false,
// // });

// // // Check if the transaction is successful
// // if (transaction.status === 'SUCCESS') {
// //   const labelUrl = transaction.label_url;
// //   console.log('Label purchased successfully. Label URL:', labelUrl);
// //   // You can now use the label URL as needed (e.g., provide it to the client).
// //   return util.buildResponse(200, "Order transaction COMPLETE");
// // } else {
// //   // If transaction.status is not 'SUCCESS', check if transaction.shipment_label exists
// //   if (transaction.shipment_label !== undefined) {
// //     return util.buildResponse(500, `Transaction failed: ${JSON.stringify(transaction.shipment_label)}`);
// //   } else {
// //     console.error('Error purchasing label:', transaction.messages);
// //     // Handle the error as needed
// //     return util.buildResponse(500, `Transaction failed: ${transaction.status}`);
// //   }
// // }

  
//   // error...
//   return util.buildResponse(200, shippingBody);
    
//   // // Check if the transaction is successful
//   // if (transaction.status === 'SUCCESS') {
//   //   const labelUrl = transaction.label_url;
//   //   console.log('Label purchased successfully. Label URL:', labelUrl);
//   //   // You can now use the label URL as needed (e.g., provide it to the client).
//   //   return util.buildResponse(200, "Order transaction COMPLETE");
//   // } else {
//   //   // If transaction.status is not 'SUCCESS', check if transaction.status has a 'json' property
//   //   if (transaction.status && transaction.status.json) {
//   //     return util.buildResponse(500, ` SUCCESS FAIL ${JSON.stringify(transaction.status.json)}`);
//   //   } else {
//   //     console.error('Error purchasing label:', transaction.messages);
//   //     // Handle the error as needed
//   //     return util.buildResponse(500, `Transaction failed: ${transaction.status}`);
//   //   }
//   // }
    
    
//   } catch (error) {
//     console.error('Error creating shipment:', error);
//     // Handle the shipment creation error
//     return util.buildResponse(500, `Error creating shipment: ${error}`);
//   }
// }

// module.exports = buyLabel;
