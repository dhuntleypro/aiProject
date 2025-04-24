const AWS = require('aws-sdk');
AWS.config.update({
  region: 'us-east-1',
});
const jwt = require('jsonwebtoken');
const dynamodb = new AWS.DynamoDB.DocumentClient();

function generateToken(userInfo) {
  if (!userInfo) {
    return null;
  
  }

  return jwt.sign(userInfo, process.env.JWT_SECRET, {
    expiresIn: '50h',
  });
  
  
//   // Calculate the time in hours for 3 months (90 days)
// const expiresInInHours = 90 * 24 * 60; // 90 days * 24 hours/day * 60 minutes/hour

// // Create and sign the JWT with the calculated expiration time
// return jwt.sign(userInfo, process.env.JWT_SECRET, {
//   expiresIn: expiresInInHours + 'h',
// });

}











// Middleware
function authenticate(req, res, next) {
  
  
  const headers = req.headers['authorization'];
  
  if(headers) {
    const token = headers.split('')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email ;
    
    const persistedUser = userExists(email) ;
    
    if (persistedUser) {
      next() ;
      
    } else {
      res.json({message: 'Unath'}) ;
    }
  
  } else {
      res.json({message: 'Unath'}) ;

  }
}
  




async function userExists(email) {
    const params = {
        TableName: 'prof-website-user-table',
        Key: {
            email: email,
        },
    };

    try {
        const data = await dynamodb.get(params).promise();
        return !!data.Item; // Returns true if the user exists, false if not
    } catch (error) {
        console.error('Error checking user existence:', error);
        return false; // Return false in case of an error
    }
}







// function verifyToken(email, token) {
//   return jwt.verify(token, process.env.JWT_SECRET, (error, response) => {
//     if (error) {
//       return {
//         verified: false,
//         message: 'invalid token',
//       };
//     }

//     if (response.email !== email) {
//       return {
//         verified: false,
//         message: 'invalid user',
//       };
//     }

//     return {
//       verified: true,
//       message: 'verifed',
//     };
//   });
  
// }
  
  
  
  
  
  
  
  
  
  
  
//   // Pseudocode for generating and returning an access token
// function authenticateUser(username, password) {
//     // Check username and password against your authentication mechanism
//     if (validCredentials) {
//         const accessToken = generateAccessToken(username);
//         return {
//             accessToken: accessToken
//         };
//     }
// }

// function generateAccessToken(username) {
//     // Generate and return an access token
//     // This can be a JWT or any other secure token format
// }

// // Example API endpoint for user authentication
// function authenticateUserHandler(event) {
//     const { username, password } = event.body;
//     const authenticationResult = authenticateUser(username, password);
//     return util.buildResponse(200, authenticationResult);
// }

module.exports.generateToken = generateToken;
module.exports.authenticate = authenticate;
// module.exports.verifyToken = verifyToken;
