const util = require('./util');
const fs = require('fs');
const path = require('path');

async function convertData(body) {
  try {
    // Validate required query parameters
    // if (!destination || !fileName) {
    //   return util.buildResponse(400, { error: 'Missing required query parameters: destination or fileName' });
    // }

    // Validate and parse the request body
    let parsedBody;
    if (typeof body === 'string') {
      console.log('Raw Body Received:', body); // Log raw body for debugging
      try {
        // Attempt to parse as JSON
        parsedBody = JSON.parse(body);
      } catch (error) {
        console.error('Error parsing JSON body:', error);
        // If JSON parsing fails, treat the body as raw Base64
        parsedBody = { fileData: body };
      }
    } else {
      // Assume body is already parsed (e.g., object format)
      parsedBody = body;
    }

    // Validate Base64 file data
    const fileDataBase64 = parsedBody?.fileData;
    if (!fileDataBase64 || typeof fileDataBase64 !== 'string') {
      return {
        error: 'Missing or invalid fileData in the request body',
        statusCode: 400,
      };
    }

    // Decode Base64 data into binary
    let fileBuffer;
    try {
      fileBuffer = Buffer.from(fileDataBase64, 'base64');
    } catch (error) {
      console.error('Error decoding Base64 file data:', error);
      return {
        error: 'Invalid Base64 data in fileData',
        statusCode: 400,
      };
    }
    console.log('Decoded File Data Size:', fileBuffer.length);

    // Determine Content-Type
    const contentType = body.headers?.['Content-Type'] || 'application/octet-stream';
    console.log('Content-Type:', contentType);

    // Construct the response object
    const response = {
      fileBuffer,
      contentType,
      statusCode: 200,
    };

    // Return the response object
    return response;

  } catch (error) {
    console.error('Error occurred:', error.message || error);
    return {
      error: 'An error occurred while processing the request',
      details: error.message || error,
      statusCode: 500,
    };
  }
}

module.exports = convertData;





// const util = require('./util');
// const fs = require('fs');
// const path = require('path');

// async function convertData(body, destination, fileName) {
//   try {
//     // Validate required query parameters
//     if (!destination || !fileName) {
//       return util.buildResponse(400, { error: 'Missing required query parameters: destination or fileName' });
//     }

//     // Validate and parse the request body
//     let parsedBody;
//     if (typeof body === 'string') {
//       console.log('Raw Body Received:', body); // Log raw body for debugging
//       try {
//         // Attempt to parse as JSON
//         parsedBody = JSON.parse(body);
//       } catch (error) {
//         console.error('Error parsing JSON body:', error);
//         // If JSON parsing fails, treat the body as raw Base64
//         parsedBody = { fileData: body };
//       }
//     } else {
//       // Assume body is already parsed (e.g., object format)
//       parsedBody = body;
//     }

//     // Validate Base64 file data
//     const fileDataBase64 = parsedBody?.fileData;
//     if (!fileDataBase64 || typeof fileDataBase64 !== 'string') {
//       return {
//         error: 'Missing or invalid fileData in the request body',
//         statusCode: 400,
//       };
//     }

//     // Decode Base64 data into binary
//     let fileBuffer;
//     try {
//       fileBuffer = Buffer.from(fileDataBase64, 'base64');
//     } catch (error) {
//       console.error('Error decoding Base64 file data:', error);
//       return {
//         error: 'Invalid Base64 data in fileData',
//         statusCode: 400,
//       };
//     }
//     console.log('Decoded File Data Size:', fileBuffer.length);

//     // Determine Content-Type
//     const contentType = body.headers?.['Content-Type'] || 'application/octet-stream';
//     console.log('Content-Type:', contentType);

//     // Construct the response object
//     const response = {
//       fileBuffer,
//       contentType,
//       destination,
//       fileName,
//       statusCode: 200,
//     };

//     // Return the response object
//     return response;

//   } catch (error) {
//     console.error('Error occurred:', error.message || error);
//     return {
//       error: 'An error occurred while processing the request',
//       details: error.message || error,
//       statusCode: 500,
//     };
//   }
// }

// module.exports = convertData;
