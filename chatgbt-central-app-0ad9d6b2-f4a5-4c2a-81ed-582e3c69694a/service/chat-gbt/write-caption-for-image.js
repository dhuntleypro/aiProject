const https = require("https");
const util = require("../../utils/util");
const uploadFileToS3 = require("../../utils/uploadFileToS3.js");
const convertData = require("../../utils/convertData.js");

async function writeCaptionForImage(body) {
  try {
    // Validate and parse the input data
    const result = await convertData(body);

    if (result.statusCode !== 200) {
      return util.buildResponse(result.statusCode, { error: result.error });
    }

    const { fileBuffer, contentType } = result;

    // Upload the image to S3
    const s3Response = await uploadFileToS3(fileBuffer, contentType);
    if (s3Response.statusCode !== 200) {
      return util.buildResponse(s3Response.statusCode, { error: s3Response.error });
    }

    const imageUrl = s3Response.url;

    if (!imageUrl) {
      throw new Error("Image URL is missing or invalid.");
    }

    // Prepare the OpenAI request payload
    const data = JSON.stringify({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a helpful social media assistant who writes amazing captions for images.",
        },
        {
          role: "user",
          content: `Create a caption for the image at ${imageUrl}`,
        },
      ],
    });

    // Calculate Content-Length for the request
    const contentLength = Buffer.byteLength(data);

    // HTTPS request options
    const options = {
      hostname: "api.openai.com",
      path: "/v1/chat/completions",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Length": contentLength,
      },
    };

    // Perform the HTTPS request
    const response = await new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let responseData = "";

        res.on("data", (chunk) => {
          responseData += chunk;
        });

        res.on("end", () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
              resolve(JSON.parse(responseData));
            } catch (error) {
              reject(new Error("Failed to parse response from OpenAI."));
            }
          } else {
            reject(new Error(`OpenAI API error: ${res.statusCode} - ${responseData}`));
          }
        });
      });

      req.on("error", (error) => {
        reject(error);
      });

      req.write(data); // Ensure `data` is properly passed here
      req.end();
    });

    // Extract the response content
    const descriptionContent = response.choices[0]?.message?.content?.trim();
    if (!descriptionContent) {
      throw new Error("Failed to generate a caption. No content returned.");
    }

    return util.buildResponse(200, { description: descriptionContent });
  } catch (error) {
    console.error("Error occurred:", error.message || error);
    return util.buildResponse(500, {
      message: "An error occurred while generating the caption.",
      error: error.message || error,
    });
  }
}

module.exports = writeCaptionForImage;


// const https = require('https');
// const path = require('path');
// const util = require('../../utils/util');
// const uploadFileToS3 = require('../../utils/uploadFileToS3.js');
// const convertData = require('../../utils/convertData.js');

// async function writeCaptionForImage(body) {
//   try {
//     // Validate and parse the input data
//     const result = await convertData(body);

//     if (result.statusCode !== 200) {
//       return util.buildResponse(result.statusCode, { error: result.error });
//     }

//     const { fileBuffer, contentType } = result;

//     const data = JSON.stringify({
//         model: "gpt-4o",
//         messages: [
//           {
//             role: "system",
//             content: "You are a helpful social media assistant who write amazing caprtions for images.",
//           },
//           {
//             role: "user",
//             content: "create a caption for the image",
//           },
//         ],
//       });
  
//       // Set the options for the HTTPS request
//       const options = {
//           hostname: 'api.openai.com',
//       path: '/v1/images/describe', // Replace with the correct OpenAI endpoint
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//         'Content-Length': Buffer.byteLength(body),
//       },
//     };
  
//       // Perform the HTTPS request
//       const response = await new Promise((resolve, reject) => {
//         const req = https.request(options, (res) => {
//           let responseData = '';
  
//           res.on('data', (chunk) => {
//             responseData += chunk;
//           });
  
//           res.on('end', () => {
//             if (res.statusCode >= 200 && res.statusCode < 300) {
//               resolve(JSON.parse(responseData));
//             } else {
//               reject(new Error(`OpenAI API error: ${res.statusCode} - ${responseData}`));
//             }
//           });
//         });
  
//         req.on('error', (error) => {
//           reject(error);
//         });
  
//         req.write(data);
//         req.end();
//       });
  
//       // Extract the response content
//       const descriptionContent = response.choices[0].message.content;
//     //   const descriptionContent = response.description;
  
//       return util.buildResponse(200, { description: descriptionContent });
//   } catch (error) {
//     console.error('Error occurred:', error.message || error);
//     return util.buildResponse(500, {
//       message: 'An error occurred while generating the caption.',
//       error: error.message || error,
//     });
//   }
// }

// module.exports = writeCaptionForImage;






// // working upoad to s3 - no ai
// const util = require('../../utils/util');
// const uploadFileToS3 = require('../../utils/uploadFileToS3.js');
// const convertData = require('../../utils/convertData.js');

// async function writeCaptionForImage(body , prompt) {
//   try {
//     // Convert data (validate and parse)
//     const result = await convertData(body);

//     // Check if conversion failed
//     if (result.statusCode !== 200) {
//       return util.buildResponse(result.statusCode, { error: result.error });
//     }

//     // Extract data from the conversion result
//     const { fileBuffer, contentType } = result;


//     // Chat GBT
//     // Construct the FormData payload
//     const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
//     const formData = `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${path.basename(
//       imagePath
//     )}"\r\nContent-Type: image/jpeg\r\n\r\n`;
//     const endData = `\r\n--${boundary}--\r\n`;

//     // Set the options for the HTTPS request
//     const options = {
//       hostname: 'api.openai.com',
//       path: '/v1/images/describe', // Endpoint for image-to-description
//       method: 'POST',
//       headers: {
//         'Content-Type': `multipart/form-data; boundary=${boundary}`,
//         Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // Include the Bearer token here
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

//       // Write FormData payload
//       req.write(formData);
//       imageFile.pipe(req, { end: false });
//       imageFile.on('end', () => {
//         req.end(endData);
//       });
//     });

//     // Extract the description from the response
//     const description = response.description || 'No description available';

//     return util.buildResponse(200, {description : description});


//   } catch (error) {
//     console.error('Error occurred:', error.message || error);
//     return util.buildResponse(500, {
//       message: 'An error occurred while uploading the file or processing the request.',
//       error: error.message || error,
//     });
//   }
// }

// module.exports = writeCaptionForImage;



