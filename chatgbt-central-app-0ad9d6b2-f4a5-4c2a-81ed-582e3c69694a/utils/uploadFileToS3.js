const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const util = require('./util');

// Function to upload a file to S3
async function uploadFileToS3(destination, fileName, fileData, contentType) {
    if (!destination) return util.buildResponse(404, 'Destination not found, sorry');
    if (!fileName) return util.buildResponse(404, 'FileName not found, sorry');

    // Decode the Base64 file data into binary
    const fileBuffer = Buffer.from(fileData, 'base64');

    // Construct the S3 object key
    const key = `${destination}${fileName}`;

    const params = {
        Bucket: process.env.BUCKETNAME,
        Key: key,
        Body: fileBuffer,
        ContentType: contentType,
    };

    try {
        // Upload the file to S3
        await s3.putObject(params).promise();

        // Construct the public URL for the uploaded file
        const fileUrl = `https://${process.env.BUCKETNAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

        // Log for debugging
        console.log('File uploaded successfully:', fileUrl);

        // Return the URL as part of the response
        // return util.buildResponse(200, { url: fileUrl });
        // return util.buildResponse(200, fileUrl );
        return fileUrl


    } catch (error) {
        console.error('Error uploading file to S3:', error);

        return util.buildResponse(404, { error: 'Error uploading file to S3', details: error });
    }
}

// module.exports.uploadFileToS3 = uploadFileToS3;
module.exports = uploadFileToS3;



 