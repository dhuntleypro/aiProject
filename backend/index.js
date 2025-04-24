// User Settings
const { postUserSettings } = require('./src/user/postUserSettings');
const { patchUserSettings } = require('./src/user/patchUserSettings');

// Task
const { getTasks } = require('./src/task/getTasks');
const { postTask } = require('./src/task/postTask');

// Target
const { getTargetProductDetails } = require('./src/stores/target/getTargetProductDetails');

// Seed
const { seedStores } = require('./src/lambdas/seedStores');
const { getStores } = require('./src/stores/getStores');


const AWS = require('aws-sdk');

// const lambda = new AWS.Lambda({ region: 'us-east-1' });

// async function useUtils(type, params) {
//   const response = await lambda.invoke({
//     FunctionName: 'master-utils',
//     InvocationType: 'RequestResponse',
//     Payload: JSON.stringify({ type, params }),
//   }).promise();

//   return JSON.parse(response.Payload);
// }

exports.handler = async (event) => {
  try {
    const { httpMethod, path, queryStringParameters, body } = event;


      // Create a Task
      if (path === '/bot/tasks' && httpMethod === 'GET') {
        return await getTasks(event);
      }
  

    // Create a Task
    if (path === '/bot/task/create' && httpMethod === 'POST') {
      return await postTask(event);
    }


    // Get target product detailss via url
    if (path === '/bot/stores/target/product' && httpMethod === 'POST') {
      return await getTargetProductDetails(event);
    }


    if (path === '/bot/stores' && httpMethod === 'GET') {
      return await getStores();
    }
    
    
    // Post/ Edit user bot settings
    if (path === '/bot/user-settings' && httpMethod === 'POST') {
      return await postUserSettings(event);
    }

    if (path === '/bot/user-settings' && httpMethod === 'PATCH') {
      return await patchUserSettings(event);
    }

    // if (path === '/bot/user-settings' && httpMethod === 'DELETE') {
    //   return await patchUserSettings(event);
    // }


    // add end points



















    // not an endpoint ....
    if (path === '/task/status' && httpMethod === 'GET') {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Status check successful' }),
      };
    }

    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'Route not found', path, httpMethod }),
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Internal Server Error 2',
        error: error.message,
        stack: error.stack, // 🧠 helpful for debugging
        rawEvent: event // optional: include event details
      }),
    };
  }
};
if (require.main === module) {
    (async () => {
      const testEvent = {
        path: '/bot/task/create',
        httpMethod: 'POST',
        body: JSON.stringify({
          product_id: '123',
          profile_id: 'abc',
          size: '10',
          mode: 'fast'
        })
      };
  
      const response = await exports.handler(testEvent);
      console.log('Local test response:', response);
    })();
  }
  