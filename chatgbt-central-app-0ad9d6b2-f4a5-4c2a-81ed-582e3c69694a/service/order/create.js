const AWS = require('aws-sdk');
const util = require('../../utils/util');
const getUserData = require('../../utils/get/getUserData');
const getStoreData = require('../../utils/get/getStoreData');

AWS.config.update({
  region: 'us-east-1',
});

const dynamodb = new AWS.DynamoDB.DocumentClient();
const totalWeight = 0;
const today = new Date();
const formattedToday = today.toISOString();
const taxRate = 0;

async function create(requestBody, tableName) {
  
  // Validate essential fields in requestBody
  if (!tableName) return util.buildResponse(322, 'Missing table name.');
  if (!requestBody) return util.buildResponse(322, 'Missing request body.');
  if (!requestBody.items) return util.buildResponse(322, 'Missing items.');
  if (!requestBody.to_address) return util.buildResponse(322, 'Missing to_address.');
  if (!requestBody.store_id) return util.buildResponse(322, 'Missing store_id.');
  if (!requestBody.items[0]) return util.buildResponse(322, 'Missing item 1');

  try {
    // Validate each item in the `items` array
    for (const product of requestBody.items) {
      if (!product.id || !product.quantity || !product.sku) {
        // Log invalid product data and respond with an error
        console.error(`Invalid product data: ${JSON.stringify(product)}`);
        return util.buildResponse(400, 'Invalid product data in items. Ensure each item has an id, quantity, and sku.');
      }

      // Define each line item with fallback defaults for missing values
      const lineItem = {
        "quantity": product.quantity || 0,
        "sku": product.sku || "o",
        "title": product.title || "Unknown Item",
        "total_price": `${product.total_price}` || "0",
        "length": `${product.length}` || "0",
        "width": `${product.width}` || "0",
        "height": `${product.height}` || "0",
        "weight": `${product.weight}` || "0",
        "weight_unit": `${product.weight_unit}` || "lb",
        "distance_unit": "in",
        "description": `${product.description}` || "",
        "net_weight": `${product.weight}` || "0",
        "mass_unit": "lb",
        "value_amount": `${product.total_price}` || "0",
        "value_currency": "USD",
        "origin_country": "US",
        "eccn_ear99": "3A001"
      };

      console.log(`Object ${product.id}: ${product.title}`);
    }

    // Validate `to_address` fields
    const requestBody_To_address = requestBody.to_address;
    if (!requestBody_To_address.name) return util.buildResponse(320, 'Missing recipient name in to_address.');
    if (!requestBody_To_address.phone) return util.buildResponse(320, 'Missing recipient phone in to_address.');

    // Fetch the store data
    const storeData = await getStoreData.getStoreData(requestBody.store_id);
    if (!storeData) return util.buildResponse(403, 'No Store Data');
    
    // Fetch user data
    const userData = await getUserData.getUserData(requestBody_To_address.email);
    if (!userData) return util.buildResponse(401, 'No User Data');

    const user = userData.Item;
    const store = storeData.Item;
    
    // Validate essential store fields
    if (!store.store_name) return util.buildResponse(320, 'Missing store info - update your store_name.');
    if (!store.store_address) return util.buildResponse(321, 'Missing store info - update your store_address.');
    if (!store.store_address_city) return util.buildResponse(322, 'Missing store info - update your store_address_city.');
    if (!store.store_address_state) return util.buildResponse(323, 'Missing store info - update your store_address_state.');
    if (!store.store_address_zip) return util.buildResponse(324, 'Missing store info - update your store_address_zip.');
    if (!store.phone_number) return util.buildResponse(325, 'Missing store info - update your store phone_number.');
    if (!store.email) return util.buildResponse(326, 'Missing store info - update your store email.');

    // Construct from_address based on store details
    const from_address = {
      "name": store.store_name,
      "street1": store.store_address,
      "city": store.store_address_city,
      "state": store.store_address_state,
      "zip": store.store_address_zip,
      "country": "US",
      "phone": store.phone_number,
      "email": store.email,
      "is_residential": false
    };

   
    // Define parcel data with fallback defaults
    const baseParcel = {
      
    };

    // Define order data to be saved
    const orderData = {
      TableName: tableName,
      Item: {
        ...requestBody,
        from_address: {
          "name": store.store_name,
          "streetOne": "",
          "streetTwo": "",
          "city": "",
          "state": "",
          "zip": "",
          "country": "US",
          "phone": store.phone_number,
          "email": store.email,
          "is_residential": false
        },
        to_address: {
          "name": requestBody_To_address.name,
          "streetOne": requestBody_To_address.street1,
          "streetTwo": "",
          "city": requestBody_To_address.city,
          "state": requestBody_To_address.state,
          "zip": requestBody_To_address.zip,
          "country": "US",
          "phone": requestBody_To_address.phone,
          "email": requestBody_To_address.email,
          "is_residential": false
        },
        parcel: baseParcel,
        tax: 4.0
      }
    };

    // Create the order in Shippo
    const createOrder = {
      "from_address": from_address,
      "to_address": requestBody_To_address,
      "parcels": [baseParcel],
      "line_items": [],
      "currency": "USD",
      "weight": "4",
      "total_weight": "4",
      "weight_unit": "oz",
      "length": "12",
      "width": "8",
      "height": "1",
      "placed_at": formattedToday,
      "order_number": requestBody.id,
      "order_status": "PAID",
      "shipping_cost_currency": "USD",
      "shipping_method": "USPS Ground Advantage",
      "subtotal_price": requestBody.total,
      "total_price": requestBody.total,
      "total_tax": "0.00",
      "currency": "USD",
      "async": false
    };

    // return util.buildResponse(401, createOrder);


    // Save the order data in DynamoDB
    const saveUserResponse = await saveOrder(orderData.Item, tableName);
    if (!saveUserResponse) return util.buildResponse(503, "FAIL TO SAVE");

  

    // console.log('Created Address:', createdAddress);
    // return util.buildResponse(200, createdAddress);
    return util.buildResponse(200, "worked");

  } catch (error) {
    console.error('Error creating address:', error);
    return util.buildResponse(500, `Error: ${error.message}`);
  }
}

module.exports = create;

// Save order function
async function saveOrder(responseBody, tableName) {
  const orderTable = tableName;
  const params = {
    TableName: orderTable,
    Item: responseBody,
  };

  try {
    await dynamodb.put(params).promise();
    return true;
  } catch (error) {
    console.error('Error saving order: ', error);
    return false;
  }
}

























// const AWS = require('aws-sdk');
// const shippo = require('shippo')('shippo_live_0c7c02b50e9f3c3d039b74173971828085172f21');
// const util = require('../../utils/util');
// const getUserData = require('../../utils/get/getUserData');
// const getStoreData = require('../../utils/get/getStoreData');

// AWS.config.update({
//   region: 'us-east-1',
// });

// const dynamodb = new AWS.DynamoDB.DocumentClient();
// const shippoItems = [];
// const totalWeight = 0;
// const today = new Date();
// const formattedToday = today.toISOString();
// const taxRate = 0;

// async function create(requestBody, tableName) {
  
//   // Validate essential fields in requestBody
//   if (!tableName) return util.buildResponse(322, 'Missing table name.');
//   if (!requestBody) return util.buildResponse(322, 'Missing request body.');
//   if (!requestBody.items) return util.buildResponse(322, 'Missing items.');
//   if (!requestBody.to_address) return util.buildResponse(322, 'Missing to_address.');
//   if (!requestBody.store_id) return util.buildResponse(322, 'Missing store_id.');
//   if (!requestBody.items[0]) return util.buildResponse(322, 'Missing item 1');

//   try {
//     // Validate each item in the `items` array
//     for (const product of requestBody.items) {
//       if (!product.id || !product.quantity || !product.sku) {
//         // Log invalid product data and respond with an error
//         console.error(`Invalid product data: ${JSON.stringify(product)}`);
//         return util.buildResponse(400, 'Invalid product data in items. Ensure each item has an id, quantity, and sku.');
//       }

//       // Define each line item with fallback defaults for missing values
//       const lineItem = {
//         "quantity": product.quantity || 0,
//         "sku": product.sku || "o",
//         "title": product.title || "Unknown Item",
//         "total_price": `${product.total_price}` || "0",
//         "length": `${product.length}` || "0",
//         "width": `${product.width}` || "0",
//         "height": `${product.height}` || "0",
//         "weight": `${product.weight}` || "0",
//         "weight_unit": `${product.weight_unit}` || "lb",
//         "distance_unit": "in",
//         "description": `${product.description}` || "",
//         "net_weight": `${product.weight}` || "0",
//         "mass_unit": "lb",
//         "value_amount": `${product.total_price}` || "0",
//         "value_currency": "USD",
//         "origin_country": "US",
//         "eccn_ear99": "3A001"
//       };

//       console.log(`Object ${product.id}: ${product.title}`);
//       shippoItems.push(lineItem);
//     }

//     // Validate `to_address` fields
//     const requestBody_To_address = requestBody.to_address;
//     if (!requestBody_To_address.name) return util.buildResponse(320, 'Missing recipient name in to_address.');
//     if (!requestBody_To_address.phone) return util.buildResponse(320, 'Missing recipient phone in to_address.');

//     // Fetch the store data
//     const storeData = await getStoreData.getStoreData(requestBody.store_id);
//     if (!storeData) return util.buildResponse(403, 'No Store Data');
    
//     // Fetch user data
//     const userData = await getUserData.getUserData(requestBody_To_address.email);
//     if (!userData) return util.buildResponse(401, 'No User Data');

//     const user = userData.Item;
//     const store = storeData.Item;
    
//     // Validate essential store fields
//     if (!store.store_name) return util.buildResponse(320, 'Missing store info - update your store_name.');
//     if (!store.store_address) return util.buildResponse(321, 'Missing store info - update your store_address.');
//     if (!store.store_address_city) return util.buildResponse(322, 'Missing store info - update your store_address_city.');
//     if (!store.store_address_state) return util.buildResponse(323, 'Missing store info - update your store_address_state.');
//     if (!store.store_address_zip) return util.buildResponse(324, 'Missing store info - update your store_address_zip.');
//     if (!store.phone_number) return util.buildResponse(325, 'Missing store info - update your store phone_number.');
//     if (!store.email) return util.buildResponse(326, 'Missing store info - update your store email.');

//     // Construct from_address based on store details
//     const from_address = {
//       "name": store.store_name,
//       "street1": store.store_address,
//       "city": store.store_address_city,
//       "state": store.store_address_state,
//       "zip": store.store_address_zip,
//       "country": "US",
//       "phone": store.phone_number,
//       "email": store.email,
//       "is_residential": false
//     };

//     // Attempt to create the address with Shippo
//     const createdAddress = await shippo.address.create(requestBody_To_address);

//     // Define parcel data with fallback defaults
//     const baseParcel = {
//       length: shippoItems[0]?.length || "6",
//       width: shippoItems[0]?.width || "5",
//       height: shippoItems[0]?.height || "5",
//       distance_unit: "in",
//       weight: shippoItems[0]?.weight || "80.0000",
//       mass_unit: "lb",
//       value_amount: shippoItems[0]?.value_amount || "8.90",
//       value_currency: "USD",
//       metadata: shippoItems[0]?.metadata || "",
//       test: true
//     };

//     // Define order data to be saved
//     const orderData = {
//       TableName: tableName,
//       Item: {
//         ...requestBody,
//         from_address: {
//           "name": store.store_name,
//           "streetOne": createdAddress.street1,
//           "streetTwo": "",
//           "city": createdAddress.city,
//           "state": createdAddress.state,
//           "zip": createdAddress.zip,
//           "country": "US",
//           "phone": store.phone_number,
//           "email": store.email,
//           "is_residential": false
//         },
//         to_address: {
//           "name": requestBody_To_address.name,
//           "streetOne": requestBody_To_address.street1,
//           "streetTwo": "",
//           "city": requestBody_To_address.city,
//           "state": requestBody_To_address.state,
//           "zip": requestBody_To_address.zip,
//           "country": "US",
//           "phone": requestBody_To_address.phone,
//           "email": requestBody_To_address.email,
//           "is_residential": false
//         },
//         parcel: baseParcel,
//         tax: 4.0
//       }
//     };

//     // Create the order in Shippo
//     const createOrder = {
//       "from_address": from_address,
//       "to_address": requestBody_To_address,
//       "parcels": [baseParcel],
//       "line_items": shippoItems,
//       "currency": "USD",
//       "weight": "4",
//       "total_weight": "4",
//       "weight_unit": "oz",
//       "length": "12",
//       "width": "8",
//       "height": "1",
//       "placed_at": formattedToday,
//       "order_number": requestBody.id,
//       "order_status": "PAID",
//       "shipping_cost_currency": "USD",
//       "shipping_method": "USPS Ground Advantage",
//       "subtotal_price": requestBody.total,
//       "total_price": requestBody.total,
//       "total_tax": "0.00",
//       "currency": "USD",
//       "async": false
//     };

//     return util.buildResponse(401, createOrder);


//     const createdOrder = await new Promise((resolve, reject) => {
//       shippo.order.create(createOrder, (err, order) => {
//         if (err) {
//           console.error('Error creating order:', err);
//           reject(err);
//         } else {
//           console.log('Order created successfully:', order);
//           resolve(order);
//         }
//       });
//     });

//     // Save the order data in DynamoDB
//     const saveUserResponse = await saveOrder(orderData.Item, tableName);
//     if (!saveUserResponse) return util.buildResponse(503, "FAIL TO SAVE");

//     if (!createdAddress || !createdAddress.object_id) {
//       throw new Error('Invalid From Address');
//     }

//     console.log('Created Address:', createdAddress);
//     return util.buildResponse(200, createdAddress);

//   } catch (error) {
//     console.error('Error creating address:', error);
//     return util.buildResponse(500, `Error: ${error.message}`);
//   }
// }

// module.exports = create;










// // works but got bad error handing - to account for id
// // const AWS = require('aws-sdk');
// // const shippo = require('shippo')('shippo_live_0c7c02b50e9f3c3d039b74173971828085172f21');
// // const util = require('../../utils/util');
// // const getUserData = require('../../utils/get/getUserData');
// // const getStoreData = require('../../utils/get/getStoreData');

// // AWS.config.update({
// //   region: 'us-east-1',
// // });

// // const dynamodb = new AWS.DynamoDB.DocumentClient();
// // const shippoItems = []
// // const totalWeight = 0
// // const today = new Date();
// // const formattedToday = today.toISOString();
// // const taxRate = 0

// // async function create(requestBody, tableName) {
  
  
// //   // Check for 
// //   if (!tableName) return util.buildResponse(322, 'Missing .');
// //   if (!requestBody) return util.buildResponse(322, 'Missing ..');
// //   if (!requestBody.items) return util.buildResponse(322, 'Missing ...');
// //   if (!requestBody.to_address) return util.buildResponse(322, 'Missing ....');
// //   if (!requestBody.store_id) return util.buildResponse(322, 'Missing .....');

// //   // return util.buildResponse(322, requestBody.items);
  
// //   try {
    
// //     for (const product of requestBody.items) {
        
// //         const lineItem = {
// //           "quantity": product.quantity || 0,
// //           "sku": product.sku || "o",
// //           "title": product.title || "", // product.name,
// //           "total_price": `${product.total_price}`  || "",
// //           "length":  `${product.length}`  || "", // "7",
// //           "width":  `${product.width}` || "", //"7",
// //           "height": `${product.height}` || "",// "7",
// //           "weight": `${product.weight}`  || "",
// //           "weight_unit": `${product.weight_unit}` || "", //"lb",
// //           "distance_unit": "in"  || "",
// //           "description": `${product.description}`  || "",
// //         	"net_weight":  `${product.weight}`  || "",
// //         	"mass_unit":"lb"  || "",
// //         	"value_amount":  `${product.total_price}` || "",
// //         	"value_currency":"USD",
// //         	"origin_country":"US",
// //         	"eccn_ear99": "3A001"
// //         }
      
// //         console.log(`Object ${product.id}: ${product.title}`);
      
// //         // Append all products to the shippo order
// //         shippoItems.push(lineItem)

        
// //         // Calculate total weight
// //       //  totalWeight += parseFloat(product.weight);
        
// //     }
      
    
    
// //     // // Simplified test address
// //     // const testAddress = {
// //     //   name: "John Doe",
// //     //   street1: "123 Main St",
// //     //   city: "San Francisco",
// //     //   state: "CA",
// //     //   zip: "94117",
// //     //   country: "US",
// //     //   phone: "14155552671",
// //     //   email: "john.doe@example.com",
// //     //   is_residential: false
// //     // };
    
    
    
// //     const requestBody_To_address = requestBody.to_address
    
// //     // Check
// //     if (!requestBody_To_address.name) return util.buildResponse(320, 'Missing to name');
// //     if (!requestBody_To_address.phone) return util.buildResponse(320, 'Missing to phone');


// //     // Fetch the store's data
// //     const storeData = await getStoreData.getStoreData(requestBody.store_id);
// //     if (!storeData) return util.buildResponse(403, 'No Store Data');
 
// //     // Client Data
// //     //// const userData = await getUserData.getUserData(requestBody_From_address.email);
// //     const userData = await getUserData.getUserData(requestBody_To_address.email);
// //     if (!userData) return util.buildResponse(401, 'No User Data');

// //     const user = userData.Item ;
// //     const store = storeData.Item ;
    
    
// //     // Store Check
// //     if (!store.store_name) return util.buildResponse(320, 'Missing store info - update your store_name ');
// //     if (!store.store_address) return util.buildResponse(321, 'Missing store info - update your store_address');
// //     if (!store.store_address_city) return util.buildResponse(322, 'Missing store info - update your store_address_city');
// //     if (!store.store_address_state) return util.buildResponse(323, 'Missing store info - update your store_address_state');
// //     if (!store.store_address_zip) return util.buildResponse(324, 'Missing store info - update your store_address_zip');
// //     if (!store.phone_number) return util.buildResponse(325, 'Missing store info - update your store phone_number');
// //     if (!store.email) return util.buildResponse(326, 'Missing store info - update your store email');

 
// //     const from_address = {
// //       "name": store.store_name,
// //       "street1":  store.store_address,
// //       "city":  store.store_address_city,
// //       "state": store.store_address_state,
// //       "zip":  store.store_address_zip,
// //       "country": "US",
// //       "phone":  store.phone_number, // "+1 555-1234", // 
// //       "email":  store.email, // error getting store email
// //       "is_residential": false
// //     };


// //     // Attempt to create the address with Shippo
// //     const createdAddress = await shippo.address.create(requestBody_To_address);
    
    
// //     // temporally commented out  (1)
// //     const baseParcel = {
// //       length: shippoItems[0].length ?? "6",
// //       width:shippoItems[0].width,
// //       height: shippoItems[0].height,
// //       distance_unit: "in",  // shippoItem.distance_unit,
// //       weight: 80.0000,     // shippoItem.weight,
// //       mass_unit: "lb",      // shippoItem.mass_unit,
// //       value_amount: shippoItems[0].value_amount,
// //       value_currency: "USD",
// //       metadata: "",         // shippoItem.metadata,
// //       test: true          // shippoItem.test,
// //     }
    
// //     // const baseParcel = {
// //     //   length: shippoItems[0]?.length || "10",  // Fallback to "10" if undefined
// //     //   width: shippoItems[0]?.width || "5",     // Fallback to "5" if undefined
// //     //   height: shippoItems[0]?.height || "3",   // Fallback to "3" if undefined
// //     //   distance_unit: "in",                     // Always use "in" as the unit
// //     //   weight: shippoItems[0]?.weight || "80.0000", // Fallback to "80.0000" if undefined
// //     //   mass_unit: "lb",                         // Always use "lb" as the unit
// //     //   value_amount: shippoItems[0]?.value_amount || 8.90, // Fallback to "8.90" if undefined
// //     //   value_currency: "USD",                   // Always use "USD" as the currency
// //     //   metadata: shippoItems[0]?.metadata || "", // Fallback to empty string if undefined
// //     //   test: true                               // Set to true for testing
// //     // };
    
// //     // // temporally commented out  (2)
// //     // //Crearte - cause error - format of  baseParcel
// //     // const parcel = await shippo.parcel.create(baseParcel);
    
    
    

// // // Update the requestBody with the correct from_address
// //     const orderData = {
// //       TableName: tableName,
// //       Item: {
// //         ...requestBody,
// //         from_address: {
// //           "name": store.store_name,
// //           "streetOne": createdAddress.street1, // from_address.street1,
// //           "streetTwo": "",
// //           "city": createdAddress.city, // from_address.city,
// //           "state": createdAddress.state, // from_address.state,
// //           "zip": createdAddress.zip, // from_address.zip,
// //           "country": "US",
// //           "phone": store.phone_number,
// //           "email": store.email,
// //           "is_residential": false
// //         },
// //         to_address: {
// //           "name": requestBody_To_address.name,
// //           "streetOne": requestBody_To_address.street1,
// //           "streetTwo": "",
// //           "city": requestBody_To_address.city,
// //           "state": requestBody_To_address.state,
// //           "zip": requestBody_To_address.zip,
// //           "country": "US",
// //           "phone": requestBody_To_address.phone, // user.phone_number, // changed
// //           "email": requestBody_To_address.email,// user.email, // changed
// //           "is_residential": false
// //         },
// //         parcel: baseParcel,
// //         tax: 4.0 // taxRate // calculateSalesTax(requestBody.state)
// //       //  items: [requestBody.items],
// //       }
// //     };


    
    
// //     const createOrder = {
// //       "from_address": from_address,
// //       "to_address": requestBody_To_address,
// //       // "return_address":  {
// //       //     "name": from_address.name,
// //       //     "street1": from_address.streetOne,
// //       //     "city":  from_address.city,
// //       //     "state": from_address.state,
// //       //     "zip": from_address.zip,
// //       //     "country": "US",
// //       //     "phone": from_address.phone,
// //       //     "email":  from_address.email,
// //       //     "is_residential": true
// //       //   },
      
// //       "parcels":  [baseParcel], // [parcel], // [package_info],
// //       "line_items": shippoItems,
// //       "currency": "USD",
// //       "weight": "4",
// //       "total_weight": "4",
// //       "weight_unit": "oz",
// //       "length": "12",
// //       "width": "8",
// //       "height": "1",
// //       "placed_at": formattedToday, // "2016-09-23T01:28:12Z",
// //       "order_number": requestBody.id,
// //       "order_status": "PAID",
// //     //  "shipping_cost": "12.83",
// //       "shipping_cost_currency": "USD",
// //       "shipping_method": "USPS Ground Advantage",

// //       // "shipping_method": "USPS First Class Package International Service",
// //       "subtotal_price": requestBody.total,
// //       "total_price": requestBody.total,
// //       "total_tax": "0.00",
// //       "currency": "USD",
// //       "async": false
// //     }




// //     // Create the order using async/await
// //     const createdOrder = await new Promise((resolve, reject) => {
// //       shippo.order.create(createOrder, (err, order) => {
// //         if (err) {
// //           console.error('Error creating order:', err);
// //           reject(err);
// //         } else {
// //           console.log('Order created successfully:', order);
// //           resolve(order);
// //         }
// //       });
// //     });

    

// //     const saveUserResponse = await saveOrder(orderData.Item, tableName);
// //     if (!saveUserResponse) return util.buildResponse(503, "FAIL TO SAVE");
    
     
     
    
    
    
    
    
    

// //     if (!createdAddress || !createdAddress.object_id) {
// //       throw new Error('Invalid From Address');
// //     }

// //     console.log('Created Address:', createdAddress);
// //     return util.buildResponse(200, createdAddress);

// //   } catch (error) {
// //     console.error('Error creating address:', error);
// //     return util.buildResponse(500, `Error: ${error.message}`);
// //   }
// // }

// // module.exports = create;





// // // Function to save a user
// // async function saveOrder(responseBody, tableName) {
// //   const orderTable = tableName

// //   const params = {
// //     TableName: orderTable,
// //     Item: responseBody,
// //   };

// //   try {
    
// //   // taxRate = await calculateSalesTax(responseBody.state);

    
// //     await dynamodb.put(params).promise();
// //     return true;
// //     // return util.buildResponse(200, "COMPLETE");
// //   } catch (error) {
// //     console.error('There is an error saving user: ', error);
// //     // return false;
// //     // return util.buildResponse(500, error);
// //   }
// // }










// // My old code
// // const AWS = require('aws-sdk');
// // // const shippo = no test mode or order making
// // const shippo = require('shippo')('shippo_live_0c7c02b50e9f3c3d039b74173971828085172f21');
// // const util = require('../../utils/util');
// // const getUserData = require('../../utils/get/getUserData');
// // const getStoreData = require('../../utils/get/getStoreData');

// // AWS.config.update({
// //   region: 'us-east-1',
// // });


// // const dynamodb = new AWS.DynamoDB.DocumentClient();
// // const shippoItems = []
// // const totalWeight = 0
// // const today = new Date();
// // const formattedToday = today.toISOString();
// // const taxRate = 0
 
// // async function create(requestBody, tableName) {
// //   const params = {
// //     TableName: tableName,
// //     Item: requestBody,
// //   };
  

  
// //   // CHECK FOR MISSING DATA
// //   if (!tableName) return util.buildResponse(322, 'Missing TableName');
// //   if (!requestBody) return util.buildResponse(322, 'Missing body');
// //   if (!requestBody.items) return util.buildResponse(322, 'Missing Items of Order (v1)');
// //   if (!requestBody.to_address) return util.buildResponse(322, 'Missing to_address');
// //   if (!requestBody.store_id) return util.buildResponse(322, 'Missing S');
// //   // if (!requestBody.items[1].width) return util.buildResponse(322, 'Missing order items (v2)');


// //   for (const product of requestBody.items) {
      
// //       const lineItem = {
// //         "quantity": product.quantity || 0,
// //         "sku": product.sku || "o",
// //         "title": product.title || "", // product.name,
// //         "total_price": `${product.total_price}`  || "",
// //         "length":  `${product.length}`  || "", // "7",
// //         "width":  `${product.width}` || "", //"7",
// //         "height": `${product.height}` || "",// "7",
// //         "weight": `${product.weight}`  || "",
// //         "weight_unit": `${product.weight_unit}` || "", //"lb",
// //         "distance_unit": "in"  || "",
// //         "description": `${product.description}`  || "",
// //       	"net_weight":  `${product.weight}`  || "",
// //       	"mass_unit":"lb"  || "",
// //       	"value_amount":  `${product.total_price}` || "",
// //       	"value_currency":"USD",
// //       	"origin_country":"US",
// //       	"eccn_ear99": "3A001"
// //       }
    
// //       console.log(`Object ${product.id}: ${product.title}`);
    
// //       // Append all products
// //       shippoItems.push(lineItem)
// //       // return util.buildResponse(200, lineItem);

      
// //       // Calculate total weight
// //     //  totalWeight += parseFloat(product.weight);
      
// //     }
    




// //   try {
    
// //     const requestBody_To_address = requestBody.to_address
// //   //  const requestBody_From_address = requestBody.from_address
// //       if (!requestBody_To_address.name) return util.buildResponse(320, 'Missing to name');
// //       if (!requestBody_To_address.phone) return util.buildResponse(320, 'Missing to phone');

    
// //     // return util.buildResponse(201, requestBody_To_address);
// // // return util.buildResponse(200, requestBody_To_address);
    
// //     // Fetch the store's data
// //     const storeData = await getStoreData.getStoreData(requestBody.store_id);
// //     if (!storeData) return util.buildResponse(403, 'No Store Data');
 

 
// //     // Customer
// //     // const userData = await getUserData.getUserData(requestBody_From_address.email);
// //     const userData = await getUserData.getUserData(requestBody_To_address.email);
// //     if (!userData) return util.buildResponse(401, 'No User Data');



// //     const user = userData.Item ;
// //     const store = storeData.Item ;
    
// //   if (!store.store_name) return util.buildResponse(320, 'Missing store info - update your store_name ');
// //   if (!store.store_address) return util.buildResponse(321, 'Missing store info - update your store_address');
// //   if (!store.store_address_city) return util.buildResponse(322, 'Missing store info - update your store_address_city');
// //   if (!store.store_address_state) return util.buildResponse(323, 'Missing store info - update your store_address_state');
// //   if (!store.store_address_zip) return util.buildResponse(324, 'Missing store info - update your store_address_zip');
// //   if (!store.phone_number) return util.buildResponse(325, 'Missing store info - update your store phone_number');
// //   if (!store.email) return util.buildResponse(326, 'Missing store info - update your store email');

 

// //     // const from_address = {
// //     //   "name": store.store_name,
// //     //   "street1":  store.store_address,
// //     //   "city":  store.store_address_city,
// //     //   "state": store.store_address_state,
// //     //   "zip":  store.store_address_zip,
// //     //   "country": "US",
// //     //   "phone":  store.phone_number, // "+1 555-1234", // 
// //     //   "email":  store.email, // error getting store email
// //     //   "is_residential": false
// //     // };
    
// //     const from_address = {
// //       name: store.store_name || "Default Name", // Ensure there's a fallback if store_name is not provided
// //       street1: store.store_address || "123 Default St", // Ensure there's a fallback
// //       street2: "", // Optional, can be left empty if not applicable
// //       city: store.store_address_city || "Default City",
// //       state: store.store_address_state || "CA",
// //       zip: store.store_address_zip || "94117",
// //       country: "US", // Must be a valid country code
// //       phone: store.phone_number || "+1 555 555 5555", // Ensure there's a fallback phone number
// //       email:  "default@example.com", // Ensure there's a fallback email - add back store.email
// //       is_residential: false
// //     };


// // const testAddress = {
// //   name: "John Doe",
// //   street1: "123 Main St",
// //   city: "San Francisco",
// //   state: "CA",
// //   zip: "94117",
// //   country: "US",
// //   phone: "+14155552671",
// //   email: "john.doe@example.com",
// //   is_residential: false,
// // };
     
// //     const to_address = {
// //       "name":  requestBody_To_address.name, // user.name,
// //       "street1": requestBody_To_address.streetOne, // requestBody.address,
// //       "city": requestBody_To_address.city, // requestBody.address_city,
// //       "state": requestBody_To_address.state, // requestBody.address_state,
// //       "zip": requestBody_To_address.zip, // requestBody.address_zip,
// //       "country": "US",
// //       "phone": requestBody_To_address.phone, // requestBody.phone_number,
// //       "email": requestBody_To_address.email, // requestBody.email,
// //       "is_residential": true
// //     };
     

// //   const baseParcel = {
// //     length: shippoItems[0].length,
// //     width: shippoItems[0].width,
// //     height: shippoItems[0].height,
// //     distance_unit: "in",  // shippoItem.distance_unit,
// //     weight: "80.0000",     // shippoItem.weight,
// //     mass_unit: "lb",      // shippoItem.mass_unit,
// //     value_amount: 8.90,   // shippoItem.value_amount,
// //     value_currency: "USD",
// //     metadata: "",         // shippoItem.metadata,
// //     test: true          // shippoItem.test,
// //   }

  
  
// //     // const dataTest = {
// //     //   to_address,
// //     //   from_address,
// //     //   baseParcel
// //     // }
// //     // return util.buildResponse(222, dataTest); // testing

// //   // Create address for store
// //   const createdFromAddress = await shippo.address.create(testAddress);



  
// //   // Create Parcel objects
// //   const parcel = await shippo.parcel.create(baseParcel);


// //   // Get tax base on customer location


// // // Update the requestBody with the correct from_address
// //     const orderData = {
// //       TableName: tableName,
// //       Item: {
// //         ...requestBody,
// //         from_address: {
// //           "name": store.store_name,
// //           "streetOne": createdFromAddress.street1, // from_address.street1,
// //           "streetTwo": "",
// //           "city": createdFromAddress.city, // from_address.city,
// //           "state": createdFromAddress.state, // from_address.state,
// //           "zip": createdFromAddress.zip, // from_address.zip,
// //           "country": "US",
// //           "phone": store.phone_number,
// //           "email": store.email,
// //           "is_residential": false
// //         },
// //         to_address: {
// //           "name": to_address.name,
// //           "streetOne": to_address.street1,
// //           "streetTwo": "",
// //           "city": to_address.city,
// //           "state": to_address.state,
// //           "zip": to_address.zip,
// //           "country": "US",
// //           "phone": to_address.phone, // user.phone_number, // changed
// //           "email": to_address.email,// user.email, // changed
// //           "is_residential": false
// //         },
// //         parcel: baseParcel,
// //         tax: 4.0 // taxRate // calculateSalesTax(requestBody.state)
// //       //  items: [requestBody.items],
// //       }
// //     };


    
    
// //     const createOrder = {
// //       "from_address": from_address,
// //       "to_address": to_address,
// //       // "return_address":  {
// //       //     "name": from_address.name,
// //       //     "street1": from_address.streetOne,
// //       //     "city":  from_address.city,
// //       //     "state": from_address.state,
// //       //     "zip": from_address.zip,
// //       //     "country": "US",
// //       //     "phone": from_address.phone,
// //       //     "email":  from_address.email,
// //       //     "is_residential": true
// //       //   },
      
// //       "parcels": [parcel], // [package_info],
// //       "line_items": shippoItems,
// //       "currency": "USD",
// //       "weight": "4",
// //       "total_weight": "4",
// //       "weight_unit": "oz",
// //       "length": "12",
// //       "width": "8",
// //       "height": "1",
// //       "placed_at": formattedToday, // "2016-09-23T01:28:12Z",
// //       "order_number": requestBody.id,
// //       "order_status": "PAID",
// //     //  "shipping_cost": "12.83",
// //       "shipping_cost_currency": "USD",
// //       "shipping_method": "USPS Ground Advantage",

// //       // "shipping_method": "USPS First Class Package International Service",
// //       "subtotal_price": requestBody.total,
// //       "total_price": requestBody.total,
// //       "total_tax": "0.00",
// //       "currency": "USD",
// //       "async": false
// //     }




// //     // Create the order using async/await
// //     const createdOrder = await new Promise((resolve, reject) => {
// //       shippo.order.create(createOrder, (err, order) => {
// //         if (err) {
// //           console.error('Error creating order:', err);
// //           reject(err);
// //         } else {
// //           console.log('Order created successfully:', order);
// //           resolve(order);
// //         }
// //       });
// //     });

    

// //     const saveUserResponse = await saveOrder(orderData.Item, tableName);
// //     if (!saveUserResponse) return util.buildResponse(503, "FAIL TO SAVE");
    
     
     
    
    
// //     // return util.buildResponse(200, orderData.Item);
// //     // return util.buildResponse(200, shippoItems);
// //     return util.buildResponse(200, orderData.Item.tax);
     
// //   } catch (error) {
// //     console.error('Error:', error);
// //     return util.buildResponse(500, `${error}`);
// //   }
  
  
  
// // }

// // module.exports = create;




// // // Function to save a user
// // async function saveOrder(responseBody, tableName) {
// //   const orderTable = tableName

// //   const params = {
// //     TableName: orderTable,
// //     Item: responseBody,
// //   };

// //   try {
    
// //   // taxRate = await calculateSalesTax(responseBody.state);

    
// //     await dynamodb.put(params).promise();
// //     return true;
// //     // return util.buildResponse(200, "COMPLETE");
// //   } catch (error) {
// //     console.error('There is an error saving user: ', error);
// //     // return false;
// //     // return util.buildResponse(500, error);
// //   }
// // }








// // // Function to calculate sales tax based on customer's state
// // async function  calculateSalesTax(customerState) {
// //   const salesTaxRates = {
// //     "AL": 4.0,
// //     "AK": 0.0,
// //     "AZ": 5.6,
// //     "AR": 6.5,
// //     "CA": 7.25,
// //     "CO": 2.9,
// //     "CT": 6.35,
// //     "DE": 0.0,
// //     "FL": 6.0,
// //     "GA": 4.0,
// //     "HI": 4.0,
// //     "ID": 6.0,
// //     "IL": 6.25,
// //     "IN": 7.0,
// //     "IA": 6.0,
// //     "KS": 6.5,
// //     "KY": 6.0,
// //     "LA": 4.45,
// //     "ME": 5.5,
// //     "MD": 6.0,
// //     "MA": 6.25,
// //     "MI": 6.0,
// //     "MN": 6.875,
// //     "MS": 7.0,
// //     "MO": 4.225,
// //     "MT": 0.0,
// //     "NE": 5.5,
// //     "NV": 6.85,
// //     "NH": 0.0,
// //     "NJ": 6.625,
// //     "NM": 5.125,
// //     "NY": 4.0,
// //     "NC": 4.75,
// //     "ND": 5.0,
// //     "OH": 5.75,
// //     "OK": 4.5,
// //     "OR": 0.0,
// //     "PA": 6.0,
// //     "RI": 7.0,
// //     "SC": 6.0,
// //     "SD": 4.5,
// //     "TN": 7.0,
// //     "TX": 6.25,
// //     "UT": 4.85,
// //     "VT": 6.0,
// //     "VA": 4.3,
// //     "WA": 6.5,
// //     "WV": 6.0,
// //     "WI": 5.0,
// //     "WY": 4.0
// //     // ... add other states
// //   };

// //   const taxRate = salesTaxRates[customerState];
  
// //     if (taxRate === undefined) {
// //     // Handle undefined state code, e.g., return a default tax rate or throw an error
// //     console.error(`No tax rate found for state code: ${customerState}`);
// //     return 0.1; // Or return a default tax rate
// //   } else { 
// //     return taxRate;
// //   }
  

  
// //}












// // works 
// // const shippo = require('shippo')('shippo_live_0c7c02b50e9f3c3d039b74173971828085172f21');
// // const util = require('../../utils/util');

// // async function create(requestBody, tableName) {

// //   try {
// //     // Simplified test address
// //     const testAddress = {
// //       name: "John Doe",
// //       street1: "123 Main St",
// //       city: "San Francisco",
// //       state: "CA",
// //       zip: "94117",
// //       country: "US",
// //       phone: "14155552671",
// //       email: "john.doe@example.com",
// //       is_residential: false
// //     };

// //     // Attempt to create the address with Shippo
// //     const createdAddress = await shippo.address.create(testAddress);

// //     if (!createdAddress || !createdAddress.object_id) {
// //       throw new Error('Invalid From Address');
// //     }

// //     console.log('Created Address:', createdAddress);
// //     return util.buildResponse(200, createdAddress);

// //   } catch (error) {
// //     console.error('Error creating address:', error);
// //     return util.buildResponse(500, `Error: ${error.message}`);
// //   }
// // }

// // module.exports = create;





