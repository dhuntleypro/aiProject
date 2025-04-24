// const { decode } = require('html-entities');
// const postItem = require('./lambdas/postItem');
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
//     if (!body.product_url) {
//       return {
//         statusCode: 400,
//         body: JSON.stringify({ message: 'Missing required product_url' }),
//       };
//     }

//     const requestBody = {
//       id: uuidv4(), // ← required for DynamoDB partition key
//       createdAt: new Date().toISOString(),
//       ...body,
//     };

//     const result = await postItem(requestBody, 'bot-task-table');

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


