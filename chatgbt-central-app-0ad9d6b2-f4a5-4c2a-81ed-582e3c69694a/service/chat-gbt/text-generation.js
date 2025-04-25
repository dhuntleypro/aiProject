const util = require('../../utils/util');
const https = require('https');

async function textGeneration(requestBody) {
  try {
    const { prompt } = requestBody;

    if (!prompt) {
      return util.buildResponse(400, { message: 'Prompt is required.' });
    }

    // Construct the request payload
    const data = JSON.stringify({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that provides concise and clear answers to user queries.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    // Set the options for the HTTPS request
    const options = {
      hostname: 'api.openai.com',
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // Include the Bearer token here
      },
    };

    // Perform the HTTPS request
    const response = await new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let responseData = '';

        res.on('data', (chunk) => {
          responseData += chunk;
        });

        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(JSON.parse(responseData));
          } else {
            reject(new Error(`OpenAI API error: ${res.statusCode} - ${responseData}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.write(data);
      req.end();
    });

    // Extract the response content
    const answerContent = response.choices[0].message.content;

    return util.buildResponse(200, { answer: answerContent });
  } catch (error) {
    console.error('Error occurred:', error.message || error);
    return util.buildResponse(500, {
      message: 'An error occurred while generating the answer.',
      error: error.message || error,
    });
  }
}

module.exports = textGeneration;


