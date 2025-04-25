// const util = require('../../utils/util');
// const https = require('https');

// async function uploadImageAndDescribe({ fileBuffer, contentType }) {
//   try {
//     if (!fileBuffer) {
//       return util.buildResponse(400, { message: 'File buffer is required.' });
//     }

//     const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
//     const formDataStart = `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="image.jpg"\r\nContent-Type: ${contentType}\r\n\r\n`;
//     const formDataEnd = `\r\n--${boundary}--\r\n`;

//     const options = {
//       hostname: 'api.openai.com',
//       path: '/v1/images/describe',
//       method: 'POST',
//       headers: {
//         'Content-Type': `multipart/form-data; boundary=${boundary}`,
//         Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//       },
//     };

//     const response = await new Promise((resolve, reject) => {
//       const req = https.request(options, (res) => {
//         let responseData = '';

//         res.on('data', (chunk) => {
//           responseData += chunk;
//         });

//         res.on('end', () => {
//           if (res.statusCode >= 200 && res.statusCode < 300) {
//             resolve(JSON.parse(responseData));
//           } else {
//             reject(new Error(`OpenAI API error: ${res.statusCode} - ${responseData}`));
//           }
//         });
//       });

//       req.on('error', (error) => {
//         reject(error);
//       });

//       // Write form data and file buffer to the request
//       req.write(formDataStart);
//       req.write(fileBuffer);
//       req.end(formDataEnd);
//     });

//     const description = response.description || 'No description available';

//     return util.buildResponse(200, { description });
//   } catch (error) {
//     console.error('Error occurred:', error.message || error);
//     return util.buildResponse(500, {
//       message: 'An error occurred while generating the description.',
//       error: error.message || error,
//     });
//   }
// }

// module.exports = uploadImageAndDescribe;



// const util = require('../../utils/util');
// const https = require('https');
// const fs = require('fs');
// const path = require('path');

// async function uploadImageAndDescribe(requestBody) {
//   try {
//     return util.buildResponse(200, "yessss");
//   } catch {
//     return util.buildResponse(400, "noooo");
//   }
// }
// //     const { imagePath, prompt } = requestBody;

// //     if (!imagePath) {
// //       return util.buildResponse(400, { message: 'Image path is required.' });
// //     }

// //     // Read the image file
// //     const imageFile = fs.createReadStream(imagePath);

// //     // Construct the FormData payload
// //     const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
// //     const formData = `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${path.basename(
// //       imagePath
// //     )}"\r\nContent-Type: image/jpeg\r\n\r\n`;
// //     const endData = `\r\n--${boundary}--\r\n`;

// //     // Set the options for the HTTPS request
// //     const options = {
// //       hostname: 'api.openai.com',
// //       path: '/v1/images/describe', // Endpoint for image-to-description
// //       method: 'POST',
// //       headers: {
// //         'Content-Type': `multipart/form-data; boundary=${boundary}`,
// //         Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // Include the Bearer token here
// //       },
// //     };

// //     const response = await new Promise((resolve, reject) => {
// //       const req = https.request(options, (res) => {
// //         let responseData = '';

// //         res.on('data', (chunk) => {
// //           responseData += chunk;
// //         });

// //         res.on('end', () => {
// //           if (res.statusCode >= 200 && res.statusCode < 300) {
// //             resolve(JSON.parse(responseData));
// //           } else {
// //             reject(new Error(`OpenAI API error: ${res.statusCode} - ${responseData}`));
// //           }
// //         });
// //       });

// //       req.on('error', (error) => {
// //         reject(error);
// //       });

// //       // Write FormData payload
// //       req.write(formData);
// //       imageFile.pipe(req, { end: false });
// //       imageFile.on('end', () => {
// //         req.end(endData);
// //       });
// //     });

// //     // Extract the description from the response
// //     const description = response.description || 'No description available';

// //     return util.buildResponse(200, { description });
// //   } catch (error) {
// //     console.error('Error occurred:', error.message || error);
// //     return util.buildResponse(500, {
// //       message: 'An error occurred while uploading the image or generating the description.',
// //       error: error.message || error,
// //     });
// //   }
// // }

// module.exports = uploadImageAndDescribe;
