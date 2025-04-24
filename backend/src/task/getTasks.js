const getItems = require('../lambdas/getItems');

exports.getTasks = async (event) => {
  try {
    if (event.httpMethod !== 'GET') {
      return {
        statusCode: 405,
        body: JSON.stringify({ message: 'Method Not Allowed' }),
      };
    }

    const { queryStringParameters } = event;
    const email = queryStringParameters?.email;
    const store_id = queryStringParameters?.store_id;

    if (!email || !store_id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing required query parameters: email or store_id' }),
      };
    }

    const result = await getItems('bot-task-table', email, store_id, true);
    return result;

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error fetching tasks',
        error: error.message,
        stack: error.stack,
      }),
    };
  }
};
