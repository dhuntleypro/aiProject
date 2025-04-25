// const AWS = require('aws-sdk');
// AWS.config.update({
//   region: 'us-east-1',
// });
// const jwt = require('jsonwebtoken');
// const dynamodb = new AWS.DynamoDB.DocumentClient();

// // Helper function to verify JWT token
// function decodeTo(token) {
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     return decoded;
//   } catch (error) {
//     return null; // Invalid token
//   }
// }

// // Helper function to check if a user exists (replace with your logic)

// async function userExists(email) {
//     const params = {
//         TableName: 'prof-website-user-table',
//         Key: {
//             email: email,
//         },
//     };

//     try {
//         const data = await dynamodb.get(params).promise();
//         return !!data.Item; // Returns true if the user exists, false if not
//     } catch (error) {
//         console.error('Error checking user existence:', error);
//         return false; // Return false in case of an error
//     }
// }




// // Your Lambda function
// function verify(token) {

//   // Ensure the token is provided
//   if (!token) {
//     return {
//       statusCode: 401,
//       body: JSON.stringify({ message: 'Missing token' }),
//     };
//   }

//   // Verify the token
//   const decodedToken = verifyToken(token);

//   if (!decodedToken) {
//     return {
//       statusCode: 401,
//       body: JSON.stringify({ message: 'Invalid token' }),
//     };
//   }

//   // Extract email from the token
//   const email = decodedToken.email;

//   // Check if the user exists
//   const user = userExists(email);

//   if (!user) {
//     return {
//       statusCode: 403,
//       body: JSON.stringify({ message: 'User not found' }),
//     };
//   }

//   // Continue processing with the authenticated user
//   const authenticatedUser = user;

//   // Your Lambda function logic here

//   return {
//     statusCode: 200,
//     body: JSON.stringify({ message: 'Authentication successful', user: authenticatedUser }),
//   };
// };
