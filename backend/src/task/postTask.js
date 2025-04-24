const { v4: uuidv4 } = require('uuid');
const AWS = require('aws-sdk');
const postItem = require('../lambdas/postItem');

AWS.config.update({ region: 'us-east-1' });

const dynamodb = new AWS.DynamoDB.DocumentClient();
const STORE_TABLE = 'bot-shopping-stores-table';
const TASK_TABLE = 'bot-task-table';

exports.postTask = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ message: 'Method Not Allowed' }),
      };
    }

    const body = JSON.parse(event.body || '{}');
    const {
      store_id,
      product_url,
      site,
      profile_id,
      product_price,
      image,
      keywords,
      quantity,
      size_preference,
      color,
      style,
      card_id,
      proxy_group_id,
      max_retries,
      schedule_at,
      tag,
      notes,
      is_test,
      user_id = 'guest', // 🔐 Replace with real session-based user ID
    } = body;

    if (!store_id || !product_url ) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Missing required fields: store_id, product_url, or profile_id',
        }),
      };
    }

    // Fetch store data
    const storeData = await dynamodb
      .get({
        TableName: STORE_TABLE,
        Key: { id: site },
      })
      .promise();



    const store = storeData.Item;
    const now = new Date().toISOString();

    const taskPayload = {
      id: uuidv4(),
      index: 0, // 🧠 Add logic later if needed
      name: `Task for ${store.name}`,
      store_id,
      user_id,

      // Targeting
      site,
      product_url,
      product_price: product_price || 0,
      image: image || '',
      store_url: store.base_url,
      keywords: keywords || [],
      quantity: quantity || 1,
      size_preference: size_preference || 'any',
      color: color || '',
      style: style || '',
      card_id: card_id || '',

      // Profile & Proxy
      profile_id,
      proxy_group_id: proxy_group_id || '',

      // Checkout Behavior
      mode: store.mode,
      delay: store.delays,
      retry_delay: store.delays.retry,
      monitor_delay: store.delays.monitor,
      max_retries: max_retries || 3,

      // Status
      status: 'idle',
      logs: [],

      // Scheduling
      created_at: now,
      started_at: '',
      completed_at: '',
      schedule_at: schedule_at || '',

      // Result Metadata
      success: false,
      decline_reason: '',
      order_number: '',
      checkout_token: '',
      raw_response: null,

      // UI-related
      pinned: false,
      tag: tag || '',
      notes: notes || '',
      active: true,

      // Internal
      is_test: is_test || false,
      updated_at: now,
    };

    const result = await postItem(taskPayload, TASK_TABLE);

    return result;
  } catch (error) {
    console.error('❌ postTask error:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error creating task',
        error: error.message,
        stack: error.stack,
      }),
    };
  }
};








// const { decode } = require('html-entities');
// const postItem = require('../lambdas/postItem');
// const { v4: uuidv4 } = require('uuid'); // make sure to npm install uuid if needed

// exports.postTask = async (event) => {
//   try {
//     if (event.httpMethod !== 'POST') {
//       return {
//         statusCode: 405,
//         body: JSON.stringify({ message: 'Method Not Allowed' }),
//       };
//     }

  
//     const body = JSON.parse(event.body || '{}');
//     const { store_id, product_url } = body;

//     if (!store_id || !product_url) {
//       return {
//         statusCode: 400,
//         body: JSON.stringify({ message: 'Missing store_id or product_url' }),
//       };
//     }

//     // 🧠 Get store config from DynamoDB
//     const storeData = await dynamodb.get({
//       TableName: STORE_TABLE,
//       Key: { id: store_id },
//     }).promise();

//     if (!storeData.Item) {
//       return {
//         statusCode: 400,
//         body: JSON.stringify({ message: `Invalid store_id: ${store_id}` }),
//       };
//     }

//     const store = storeData.Item;

//     const taskPayload = {
//       id: uuidv4(),
//       index: 0, // or fetch last index and increment
//       name: `Task for ${store.name}`,
//       store_id,
//       user_id: body.user_id || 'guest', // replace with real auth if available
    
//       site: store.id,
//       product_url: body.product_url,
//       product_price: body.product_price || 0,
//       image: body.image || '',
//       store_url: store.base_url,
//       keywords: body.keywords || [],
//       quantity: body.quantity || 1,
//       size_preference: body.size_preference || 'any',
//       color: body.color || '',
//       style: body.style || '',
//       card_id: body.card_id || '',
    
//       profile_id: body.profile_id,
//       proxy_group_id: body.proxy_group_id || '',
    
//       mode: store.mode,
//       delay: store.delays,
//       retry_delay: store.delays.retry,
//       monitor_delay: store.delays.monitor,
//       max_retries: body.max_retries || 3,
    
//       status: 'idle',
//       logs: [],
    
//       created_at: new Date().toISOString(),
//       started_at: '',
//       completed_at: '',
//       schedule_at: body.schedule_at || '',
    
//       success: false,
//       decline_reason: '',
//       order_number: '',
//       checkout_token: '',
//       raw_response: null,
    
//       pinned: false,
//       tag: '',
//       notes: '',
//       active: true,
    
//       is_test: body.is_test || false,
//       updated_at: new Date().toISOString(),
//     };
    

//     const result = await postItem(taskPayload, 'bot-task-table');

//     return result;
    
   
//   } catch (error) {
//     return {
//       statusCode: 500,
//       body: JSON.stringify({
//         message: 'Error creating task',
//         error: error.message,
//         stack: error.stack,
//       }),
//     };
//   }
// };




// const { decode } = require('html-entities');
// const postItem = require('./lambdas/postItem');

// exports.postTask = async (event) => {
//   try {
//     if (event.httpMethod !== 'POST') {
//       return {
//         statusCode: 405,
//         body: JSON.stringify({ message: 'Method Not Allowed' }),
//       };
//     }

//     const body = JSON.parse(event.body || '{}');
//     // const { product_url, profile_id, size, mode } = body;

//     // if (!product_url || !profile_id || !size || !mode) {
//       if (!body) {
//         return {
//         statusCode: 400,
//         body: JSON.stringify({ message: 'Missing required fields' }),
//       };
//     }

//     const requestBody = {
//       ...body
//       // profile_id,
//       // size,
//       // mode,
//       // createdAt: new Date().toISOString(),
//     };

//     await postItem(requestBody, 'bot-task-table');

//     return {
//       statusCode: 200,
//       body: JSON.stringify({
//         message: 'Task created successfully',
//         data: requestBody,
//       }),
//     };
//   } catch (error) {
//     return {
//       statusCode: 500,
//       body: JSON.stringify({
//         message: 'Error creating task',
//         error: error.message,
//         stack: error.stack,
//       }),
//     };
//   }
// };




// exports.postTask = async (event) => {
//   try {
//     if (event.httpMethod !== 'POST') {
//       return {
//         statusCode: 405,
//         body: JSON.stringify({ message: 'Method Not Allowed' }),
//       };
//     }

//     const body = JSON.parse(event.body || '{}');
//     const { product_id, profile_id, size, mode } = body;

//     if (!product_id || !profile_id || !size || !mode) {
//       return {
//         statusCode: 400,
//         body: JSON.stringify({ message: 'Missing required fields' }),
//       };
//     }

//     return {
//       statusCode: 200,
//       body: JSON.stringify({
//         message: 'Task created successfully',
//         data: { product_id, profile_id, size, mode },
//       }),
//     };
//   } catch (error) {
//     return {
//       statusCode: 500,
//       body: JSON.stringify({
//         message: 'Error creating task',
//         error: error.message,
//         stack: error.stack,
//       }),
//     };
//   }
// };
