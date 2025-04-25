

// working upoad to s3 - no ai
const util = require('../../utils/util');
const uploadFileToS3 = require('../../utils/uploadFileToS3.js');
const convertData = require('../../utils/convertData.js');

async function uploadMediaAndDescribe(body, destination, fileName) {
  try {
    // Convert data (validate and parse)
    const result = await convertData(body, destination, fileName);

    // Check if conversion failed
    if (result.statusCode !== 200) {
      return util.buildResponse(result.statusCode, { error: result.error });
    }

    // Extract data from the conversion result
    const { fileBuffer, contentType } = result;

    // Upload file to S3
    const response = await uploadFileToS3(destination, fileName, fileBuffer, contentType);

    // Return success response
    // return util.buildResponse(200, response);
    //     // Step 4: Return Combined Response
    return util.buildResponse(200, {
      message: 'Image uploaded and description generated successfully.',
      imageUrl: response,
      description : "iiijiji ijijiji",
    });
  } catch (error) {
    console.error('Error occurred:', error.message || error);
    return util.buildResponse(500, {
      message: 'An error occurred while uploading the file or processing the request.',
      error: error.message || error,
    });
  }
}

module.exports = uploadMediaAndDescribe;













// // working upoad to s3 - no ai
// const util = require('../../utils/util');
// const uploadFileToS3 = require('../../utils/uploadFileToS3.js');
// const convertData = require('../../utils/convertData.js');

// async function uploadMediaAndDescribe(body, destination, fileName) {
//   try {
//     // Convert data (validate and parse)
//     const result = await convertData(body, destination, fileName);

//     // Check if conversion failed
//     if (result.statusCode !== 200) {
//       return util.buildResponse(result.statusCode, { error: result.error });
//     }

//     // Extract data from the conversion result
//     const { fileBuffer, contentType } = result;

//     // Upload file to S3
//     const response = await uploadFileToS3(destination, fileName, fileBuffer, contentType);

//     // Return success response
//     // return util.buildResponse(200, response);
//     //     // Step 4: Return Combined Response
//     return util.buildResponse(200, {
//       message: 'Image uploaded and description generated successfully.',
//       imageUrl: response,
//       description : "iiijiji ijijiji",
//     });
//   } catch (error) {
//     console.error('Error occurred:', error.message || error);
//     return util.buildResponse(500, {
//       message: 'An error occurred while uploading the file or processing the request.',
//       error: error.message || error,
//     });
//   }
// }

// module.exports = uploadMediaAndDescribe;








// const util = require('../../utils/util');
// const fs = require('fs');
// const path = require('path');
// const uploadFileToS3 = require('../../utils/uploadFileToS3.js');


// async function uploadMediaAndDescribe(body, destination, fileName) {
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
//       return util.buildResponse(400, { error: 'Missing or invalid fileData in the request body' });
//     }

//     // Decode Base64 data into binary
//     let fileBuffer;
//     try {
//       fileBuffer = Buffer.from(fileDataBase64, 'base64');
//     } catch (error) {
//       console.error('Error decoding Base64 file data:', error);
//       return util.buildResponse(400, { error: 'Invalid Base64 data in fileData' });
//     }
//     console.log('Decoded File Data Size:', fileBuffer.length);

//     // Determine Content-Type
//     const contentType = body.headers?.['Content-Type'] || 'application/octet-stream';
//     console.log('Content-Type:', contentType);

//     // Simulate upload and description generation
//     // TODO: Add actual upload logic here
//     // console.log(`Uploading to destination: ${destination}, with fileName: ${fileName}`);

//     // return util.buildResponse(200, {
//     //   message: 'File successfully processed.',
//     //   contentType,
//     //   fileSize: fileBuffer.length,
//     // });

//     // temp removed...
//     try {
//       response = await uploadFileToS3(destination, fileName, fileBuffer, contentType);
//       return util.buildResponse(200, response);

//     } catch (error) {
//       console.error('Error in uploadFileToS3 ', error);
//       return util.buildResponse(400, { error: 'Invalid Base64 data in fileData' });
//     }


//   } catch (error) {
//     console.error('Error occurred:', error.message || error);
//     return util.buildResponse(500, {
//       message: 'An error occurred while uploading the file or processing the request.',
//       error: error.message || error,
//     });
//   }
// }

// module.exports = uploadMediaAndDescribe;
















// const util = require('../../utils/util');
// const https = require('https');
// const fs = require('fs');
// const path = require('path');

// async function uploadMediaAndDescribe(requestBody , destination , fileName ) {
//   try {
//       // Validate required query parameters
//       if (!destination || !fileName) {
//         return util.buildResponse(400, { error: 'Missing required query parameters: destination or fileName' });
//       }
  
//       // Parse and validate the request body
//       let parsedBody;
//       if (typeof body === 'string') {
//         console.log('Raw Body Received:', body); // Log raw body for debugging
//         try {
//           // Attempt to parse as JSON
//           parsedBody = JSON.parse(body);
//         } catch (error) {
//           console.error('Error parsing JSON body:', error);
  
//           // If JSON parsing fails, treat the body as raw Base64
//           parsedBody = { fileData: body };
//         }
//       } else {
//         // Assume body is already parsed (e.g., binary or object format)
//         parsedBody = body;
//       }
  
//       // Validate Base64 file data
//       const fileDataBase64 = parsedBody?.fileData;
//       if (!fileDataBase64 || typeof fileDataBase64 !== 'string') {
//         return util.buildResponse(400, { error: 'Missing or invalid fileData in the request body' });
//       }
  
//       // Decode Base64 data into binary
//       let fileBuffer;
//       try {
//         fileBuffer = Buffer.from(fileDataBase64, 'base64');
//       } catch (error) {
//         console.error('Error decoding Base64 file data:', error);
//         return util.buildResponse(400, { error: 'Invalid Base64 data in fileData' });
//       }
//       console.log('Decoded File Data Size:', fileBuffer.length);
  
//       // Determine Content-Type
//       const contentType = event.headers['Content-Type'] || 'application/octet-stream';
//       console.log('Content-Type:', contentType);
  

//     return util.buildResponse(300, "inside" );

    
//     // return util.buildResponse(200, { description });
//   } catch (error) {
//     console.error('Error occurred:', error.message || error);
//     return util.buildResponse(500, {
//       message: 'An error occurred while uploading the image or generating the description.',
//       error: error.message || error,
//     });
//   }
// }

// module.exports = uploadMediaAndDescribe;





// const AWS = require('aws-sdk');
// const sharp = require('sharp');
// const util = require('./util');

// const s3 = new AWS.S3();

// // async function uploadMediaAndDescribe(destination, fileName, fileData, contentType) {
//   async function uploadMediaAndDescribe(destination, fileName) {
//     try {
//     // Validate required query parameters
//     // if (!destination || !fileName) {
//     //   return util.buildResponse(400, { error: 'Missing required query parameters: destination or fileName' });
//     // }
//     response = util.buildResponse(200, "Inside function")

//     // // Parse and validate the request body
//     // let parsedBody;
//     // if (typeof body === 'string') {
//     //   console.log('Raw Body Received:', body); // Log raw body for debugging
//     //   try {
//     //     // Attempt to parse as JSON
//     //     parsedBody = JSON.parse(body);
//     //   } catch (error) {
//     //     console.error('Error parsing JSON body:', error);

//     //     // If JSON parsing fails, treat the body as raw Base64
//     //     parsedBody = { fileData: body };
//     //   }
//     // } else {
//     //   // Assume body is already parsed (e.g., binary or object format)
//     //   parsedBody = body;
//     // }

//     // // Validate Base64 file data
//     // const fileDataBase64 = parsedBody?.fileData;
//     // if (!fileDataBase64 || typeof fileDataBase64 !== 'string') {
//     //   return util.buildResponse(400, { error: 'Missing or invalid fileData in the request body' });
//     // }

//     // // Decode Base64 data into binary
//     // let fileBuffer;
//     // try {
//     //   fileBuffer = Buffer.from(fileDataBase64, 'base64');
//     // } catch (error) {
//     //   console.error('Error decoding Base64 file data:', error);
//     //   return util.buildResponse(400, { error: 'Invalid Base64 data in fileData' });
//     // }
//     // console.log('Decoded File Data Size:', fileBuffer.length);

//     // // Determine Content-Type
//     // const contentType = event.headers['Content-Type'] || 'application/octet-stream';
//     // console.log('Content-Type:', contentType);

//     // // Call the S3 upload function
//     // // response = await uploadFileToS3.uploadFileToS3(destination, fileName, fileBuffer, contentType);
//     // // console.log('S3 Upload Response:', response);
//     // response = util.buildResponse(200, {destination, fileName, fileBuffer, contentType})

//   } catch (error) {
//     console.error('Error in /uploadtos3 handler:', error);
//     response = util.buildResponse(500, { error: 'Internal server error', details: error.message });
//   }


// }


// module.exports = uploadMediaAndDescribe;















// const AWS = require('aws-sdk');
// const sharp = require('sharp');
// const util = require('./util');

// const s3 = new AWS.S3();

// async function uploadMediaAndDescribe(destination, fileName, fileData, contentType) {
//   if (!destination || !fileName || !fileData) {
//     console.error('Missing parameters');
//     return util.buildResponse(400, { error: 'Destination, fileName, and fileData are required' });
//   }

//   try {
//     // Decode the Base64 file data into binary
//     let fileBuffer = Buffer.from(fileData, 'base64');
//     console.log(`Original file size: ${fileBuffer.length} bytes`);

//     // Set size limit and compress image if needed
//     const maxFileSize = 10 * 1024 * 1024; // 10 MB
//     if (fileBuffer.length > maxFileSize && contentType.startsWith('image/')) {
//         return util.buildResponse(413, { error: 'Compressed file exceeds 10 MB limit....' });

//       console.log('Image exceeds size limit. Compressing...');
//       fileBuffer = await sharp(fileBuffer)
//         .resize({ width: 1920 }) // Adjust width to fit needs
//         .jpeg({ quality: 75 }) // Further reduce quality if necessary
//         .toBuffer();
//       console.log(`Compressed file size: ${fileBuffer.length} bytes`);
//     }

//     // Check if compressed file still exceeds the limit
//     if (fileBuffer.length > maxFileSize) {
//       console.error('Compressed image still exceeds the size limit');
//       return util.buildResponse(413, { error: 'Compressed file exceeds 10 MB limit' });
//     }

//     // Construct the S3 object key
//     const key = `${destination}${fileName}`;
//     const params = {
//       Bucket: process.env.BUCKETNAME,
//       Key: key,
//       Body: fileBuffer,
//       ContentType: contentType || 'application/octet-stream',
//       ACL: 'public-read',
//     };

//     // Upload to S3
//     const result = await s3.putObject(params).promise();
//     console.log('S3 Upload Result:', result);

//     // Generate public URL
//     const fileUrl = `https://${process.env.BUCKETNAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
//     return util.buildResponse(200, { url: fileUrl });
//   } catch (error) {
//     console.error('Error uploading file to S3:', error.message);
//     return util.buildResponse(500, { error: 'Error uploading file to S3', details: error.message });
//   }
// }


// module.exports = uploadMediaAndDescribe;




// const AWS = require('aws-sdk');
// const sharp = require('sharp');
// const fs = require('fs');
// const path = require('path');
// const util = require('./util');
// const https = require('https');

// async function uploadMediaAndDescribe(fileData, fileName, mediaType) {
//   if (!fileData || !fileName || !mediaType) {
//     console.error('Missing parameters');
//     return util.buildResponse(400, { error: 'File data, fileName, and mediaType are required.' });
//   }

//   try {
//     // Decode the Base64 file data into binary
//     let fileBuffer = Buffer.from(fileData, 'base64');
//     console.log(`Original file size: ${fileBuffer.length} bytes`);

//     // Set size limit and compress image if needed
//     const maxFileSize = 10 * 1024 * 1024; // 10 MB
//     if (fileBuffer.length > maxFileSize && mediaType === 'image') {
//       console.log('Image exceeds size limit. Compressing...');
//       fileBuffer = await sharp(fileBuffer)
//         .resize({ width: 1920 }) // Adjust width as needed
//         .jpeg({ quality: 75 }) // Adjust quality as needed
//         .toBuffer();
//       console.log(`Compressed file size: ${fileBuffer.length} bytes`);
//     }

//     // Check if compressed file still exceeds the limit
//     if (fileBuffer.length > maxFileSize) {
//       console.error('Compressed image still exceeds the size limit');
//       return util.buildResponse(413, { error: 'Compressed file exceeds 10 MB limit.' });
//     }

//     // Save the file locally for further processing
//     const tempFilePath = path.join(__dirname, 'uploads', fileName);
//     fs.writeFileSync(tempFilePath, fileBuffer);
//     console.log(`File saved at: ${tempFilePath}`);

//     // Send the file to ChatGPT's description endpoint
//     const description = await sendFileToChatGPT(tempFilePath, mediaType);

//     // Clean up the temporary file
//     fs.unlinkSync(tempFilePath);

//     return util.buildResponse(200, { description });
//   } catch (error) {
//     console.error('Error processing file or generating description:', error.message);
//     return util.buildResponse(500, { error: 'Error occurred', details: error.message });
//   }
// }

// async function sendFileToChatGPT(filePath, mediaType) {
//   const contentType = mediaType === 'image' ? 'image/jpeg' : 'video/mp4';
//   const endpoint = mediaType === 'image' ? '/v1/images/describe' : '/v1/videos/describe';

//   const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
//   const formData = `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${path.basename(
//     filePath
//   )}"\r\nContent-Type: ${contentType}\r\n\r\n`;
//   const endData = `\r\n--${boundary}--\r\n`;

//   const options = {
//     hostname: 'api.openai.com',
//     path: endpoint,
//     method: 'POST',
//     headers: {
//       'Content-Type': `multipart/form-data; boundary=${boundary}`,
//       Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//     },
//   };

//   return new Promise((resolve, reject) => {
//     const req = https.request(options, (res) => {
//       let responseData = '';

//       res.on('data', (chunk) => {
//         responseData += chunk;
//       });

//       res.on('end', () => {
//         if (res.statusCode >= 200 && res.statusCode < 300) {
//           const parsedData = JSON.parse(responseData);
//           resolve(parsedData.description || 'No description available');
//         } else {
//           reject(new Error(`OpenAI API error: ${res.statusCode} - ${responseData}`));
//         }
//       });
//     });

//     req.on('error', (error) => {
//       reject(error);
//     });

//     // Write FormData payload
//     req.write(formData);
//     const fileStream = fs.createReadStream(filePath);
//     fileStream.pipe(req, { end: false });
//     fileStream.on('end', () => {
//       req.end(endData);
//     });
//   });
// }

// module.exports.uploadMediaAndDescribe = uploadMediaAndDescribe;






// const https = require('https');
// const AWS = require('aws-sdk');
// const path = require('path');
// const util = require('../../utils/util');
// const { Readable } = require('stream');

// AWS.config.update({ region: process.env.AWS_REGION });
// const s3 = new AWS.S3();

// async function uploadMediaAndDescribe(requestBody) {
//   try {
//     const { fileUrl, mediaType } = requestBody;

//     if (!fileUrl) {
//       return util.buildResponse(400, { message: 'File URL is required.' });
//     }

//     if (!['image', 'video'].includes(mediaType)) {
//       return util.buildResponse(400, { message: 'Invalid media type. Use "image" or "video".' });
//     }

//     const contentType = mediaType === 'image' ? 'image/jpeg' : 'video/mp4';
//     const endpoint = mediaType === 'image' ? '/v1/images/describe' : '/v1/videos/describe';

//     // Extract Bucket and Key from the S3 URL
//     const s3Regex = /^https:\/\/([^/]+)\.s3\.[^/]+\.amazonaws\.com\/(.+)$/;
//     const match = fileUrl.match(s3Regex);

//     if (!match) {
//       return util.buildResponse(400, { message: 'Invalid S3 URL format.' });
//     }

//     const bucketName = match[1];
//     const key = match[2];

//     // Fetch the file from S3
//     const s3Object = await s3.getObject({ Bucket: bucketName, Key: key }).promise();
//     const fileBuffer = s3Object.Body;

//     // Construct the FormData payload
//     const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
//     const formData = `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${path.basename(
//       key
//     )}"\r\nContent-Type: ${contentType}\r\n\r\n`;
//     const endData = `\r\n--${boundary}--\r\n`;

//     const options = {
//       hostname: 'api.openai.com',
//       path: endpoint,
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

//       // Write FormData payload
//       req.write(formData);
//       const readableStream = Readable.from(fileBuffer);
//       readableStream.pipe(req, { end: false });
//       readableStream.on('end', () => {
//         req.end(endData);
//       });
//     });

//     // Extract the description from the response
//     const description = response.description || 'No description available';

//     return util.buildResponse(200, { description });
//   } catch (error) {
//     console.error('Error occurred:', error.message || error);
//     return util.buildResponse(500, {
//       message: 'An error occurred while uploading the media or generating the description.',
//       error: error.message || error,
//     });
//   }
// }

// module.exports = uploadMediaAndDescribe;


// const util = require('../../utils/util');
// const https = require('https');
// const AWS = require('aws-sdk');
// const path = require('path');
// const { Readable } = require('stream');

// AWS.config.update({ region: process.env.AWS_REGION });

// const s3 = new AWS.S3();

// async function uploadMediaAndDescribe(requestBody) {
//   try {
//     const { fileUrl, mediaType } = requestBody;

//     if (!fileUrl) {
//       return util.buildResponse(400, { message: 'File URL is required.' });
//     }

//     if (!['image', 'video'].includes(mediaType)) {
//       return util.buildResponse(400, { message: 'Invalid media type. Use "image" or "video".' });
//     }

//     // Determine content type and endpoint based on media type
//     const contentType = mediaType === 'image' ? 'image/jpeg' : 'video/mp4';
//     const endpoint = mediaType === 'image' ? '/v1/images/describe' : '/v1/videos/describe';

//     // Extract Bucket and Key from the S3 URL
//     const s3Regex = /^https:\/\/([^/]+)\.s3\.[^/]+\.amazonaws\.com\/(.+)$/;
//     const match = fileUrl.match(s3Regex);

//     if (!match) {
//       return util.buildResponse(400, { message: 'Invalid S3 URL format.' });
//     }

//     const bucketName = match[1];
//     const key = match[2];

//     console.log(`Derived Bucket: ${bucketName}, Key: ${key}`);

//     // Fetch file from S3
//     const s3Object = await s3.getObject({ Bucket: bucketName, Key: key }).promise();
//     const fileStream = Readable.from(s3Object.Body); // Convert S3 object to stream

//     // Construct the FormData payload
//     const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
//     const formData = `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${path.basename(
//       key
//     )}"\r\nContent-Type: ${contentType}\r\n\r\n`;
//     const endData = `\r\n--${boundary}--\r\n`;

//     // Set the options for the HTTPS request
//     const options = {
//       hostname: 'api.openai.com',
//       path: endpoint,
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

//       // Write FormData payload
//       req.write(formData);
//       fileStream.pipe(req, { end: false });
//       fileStream.on('end', () => {
//         req.end(endData);
//       });
//     });

//     // Extract the description from the response
//     const description = response.description || 'No description available';

//     return util.buildResponse(200, { description });
//   } catch (error) {
//     console.error('Error occurred:', error.message || error);
//     return util.buildResponse(500, {
//       message: 'An error occurred while uploading the media or generating the description.',
//       error: error.message || error,
//     });
//   }
// }

// module.exports = uploadMediaAndDescribe;




// const util = require('../../utils/util');
// const https = require('https');
// const fs = require('fs');
// const path = require('path');

// async function uploadMediaAndDescribe(requestBody) {
//   try {
//     const { filePath, mediaType } = requestBody;

//     if (!filePath) {
//       return util.buildResponse(400, { message: 'File path is required.' });
//     }

//     if (!['image', 'video'].includes(mediaType)) {
//       return util.buildResponse(400, { message: 'Invalid media type. Use "image" or "video".' });
//     }

//     // Determine content type and endpoint based on media type
//     const contentType = mediaType === 'image' ? 'image/jpeg' : 'video/mp4';
//     const endpoint = mediaType === 'image' ? '/v1/images/describe' : '/v1/videos/describe';

//     // Read the file
//     const fileStream = fs.createReadStream(filePath);

//     // Construct the FormData payload
//     const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
//     const formData = `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${path.basename(
//       filePath
//     )}"\r\nContent-Type: ${contentType}\r\n\r\n`;
//     const endData = `\r\n--${boundary}--\r\n`;

//     // Set the options for the HTTPS request
//     const options = {
//       hostname: 'api.openai.com',
//       path: endpoint, // Dynamically determine endpoint
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
//       fileStream.pipe(req, { end: false });
//       fileStream.on('end', () => {
//         req.end(endData);
//       });
//     });

//     // Extract the description from the response
//     const description = response.description || 'No description available';

//     return util.buildResponse(200, { description });
//   } catch (error) {
//     console.error('Error occurred:', error.message || error);
//     return util.buildResponse(500, {
//       message: 'An error occurred while uploading the media or generating the description.',
//       error: error.message || error,
//     });
//   }
// }

// module.exports = uploadMediaAndDescribe;
