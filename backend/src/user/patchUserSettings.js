const patchItem = require('../lambdas/patchItem');

exports.patchUserSettings = async (event) => {
  try {
    if (event.httpMethod !== 'patch') {
      return {
        statusCode: 405,
        body: JSON.stringify({ message: 'Method Not Allowed' }),
      };
    }

    const body = JSON.parse(event.body || '{}');
    const { tableName = 'bot-user-settings-table', id } = event.queryStringParameters || {};

    if (!tableName || !id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing tableName or id' }),
      };
    }

    const item = {
      ...body,
      id,
      updated_at: new Date().toISOString(),
    };

    const result = await patchItem(item);
    return result;

  } catch (error) {
    console.error("🔥 patchUserSettings error:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error saving user settings',
        error: error.message,
        stack: error.stack,
      }),
    };
  }
};
