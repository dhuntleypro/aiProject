const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const util = require('./util');


// Function to upload a file to S3



async function uploadFileToS3(destination, fileName , fileData, contentType ) {


             if (!destination) return util.buildResponse(404, 'destination not found, sorry');
             if (!fileName) return util.buildResponse(404, 'fileName not found, sorry');
              
                  // Decode the Base64 file data into binary
                    const fileBuffer = Buffer.from(fileData, 'base64');

                    
                    // const key = 'destination-path/filenamer.png'; // Specify the desired path and filename in the S3 bucket
                    const key = `${destination}${fileName}`; // Specify the desired path and filename in the S3 bucket

                    const params = {
                        Bucket: process.env.BUCKETNAME,
                        Key: key,
                        Body: fileBuffer,
                        ContentType: contentType,
                    };

                    try {
                        await s3.putObject(params).promise();
                                console.log('File Data 02:', fileData);

                         return util.buildResponse(200, 'File uploaded successfully');
                      
                    } catch (error) {
                            console.error('Error uploading file to S3:', error);

                      return util.buildResponse(404, error);
                    }
                } 
      

 module.exports.uploadFileToS3 = uploadFileToS3;
