const AWS = require('aws-sdk');
const  {shoppingStoresData}  = require('../models/shoppingStoresData');

console.log('🧠 Loaded shoppingStoresData:', typeof shoppingStoresData, Array.isArray(shoppingStoresData));

AWS.config.update({ region: 'us-east-1' });
const dynamodb = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = 'bot-shopping-stores-table';

exports.seedStores = async () => {
  try {
    if (!Array.isArray(shoppingStoresData)) {
      throw new Error('❌ shoppingStoresData is not an array');
    }

    for (const store of shoppingStoresData) {
      console.log('➡️ Seeding store:', store.name);

      const params = {
        TableName: TABLE_NAME,
        Item: store,
      };

      await dynamodb.put(params).promise();
      console.log(`✅ Uploaded: ${store.name}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'All stores seeded successfully.',
        total: shoppingStoresData.length,
      }),
    };
  } catch (error) {
    console.error('❌ Seed failed:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error seeding store data',
        error: error.message,
        stack: error.stack,
      }),
    };
  }
};



// const AWS = require('aws-sdk');
// const { shoppingStoresData } = require('../models/shoppingStoresData');

// AWS.config.update({ region: 'us-east-1' });
// const dynamodb = new AWS.DynamoDB.DocumentClient();

// const TABLE_NAME = 'bot-shopping-stores-table';

// exports.seedStores = async () => {
//   try {
//     for (const store of shoppingStoresData) {
//       const params = {
//         TableName: TABLE_NAME,
//         Item: store,
//       };

//       await dynamodb.put(params).promise();
//       console.log(`✅ Uploaded: ${store.name}`);
//     }

//     return {
//       statusCode: 200,
//       body: JSON.stringify({
//         message: 'All stores seeded successfully.',
//         total: shoppingStoresData.length,
//       }),
//     };
//   } catch (error) {
//     console.error('❌ Seed failed:', error);

//     return {
//       statusCode: 500,
//       body: JSON.stringify({
//         message: 'Error seeding store data',
//         error: error.message,
//         stack: error.stack,
//       }),
//     };
//   }
// };

// const AWS = require('aws-sdk');
// const { shoppingStoresData } = require('../models/shoppingStoresData');


// AWS.config.update({ region: 'us-east-1' });
// const dynamodb = new AWS.DynamoDB.DocumentClient();

// const TABLE_NAME = 'bot-shopping-stores-table';

// exports.seedStores = async () => {
//   try {
//     for (const store of shoppingStoresData) {
//       const params = {
//         TableName: TABLE_NAME,
//         Item: store,
//       };

//       await dynamodb.put(params).promise();
//       console.log(`✅ Uploaded: ${store.name}`);
//     }

//     return {
//       statusCode: 200,
//       body: JSON.stringify({
//         message: 'All stores seeded successfully.',
//         total: STORES.length,
//       }),
//     };
//   } catch (error) {
//     console.error('❌ Seed failed:', error);

//     return {
//       statusCode: 500,
//       body: JSON.stringify({
//         message: 'Error seeding store data',
//         error: error.message,
//         stack: error.stack,
//       }),
//     };
//   }
// };
