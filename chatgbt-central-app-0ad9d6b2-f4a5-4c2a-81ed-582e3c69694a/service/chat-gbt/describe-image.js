

// working upoad to s3 - no ai
const util = require('../../utils/util');
const uploadFileToS3 = require('../../utils/uploadFileToS3.js');
const convertData = require('../../utils/convertData.js');

async function describeImage(body, destination, fileName) {
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

module.exports = describeImage;



