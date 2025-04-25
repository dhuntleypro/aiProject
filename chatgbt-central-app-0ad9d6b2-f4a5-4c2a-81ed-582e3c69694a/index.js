

const AWS = require('aws-sdk');
// const dynamodb = new AWS.DynamoDB();
const dynamodb = new AWS.DynamoDB.DocumentClient();
const jwt = require('jsonwebtoken'); 
const util = require('./utils/util');


// Chat-GBT
// const chatgbtAnswer =  require('./service/chat-gbt/answer');
const textGeneration = require('./service/chat-gbt/text-generation');
const uploadMediaAndDescribe = require('./service/chat-gbt/upload-media-and-describe');
const writeCaptionForImage = require('./service/chat-gbt/write-caption-for-image');


// PAY
const accountInfo = require('./service/pay/accountInfo');
const instantPayoutCustomer = require('./service/pay/instantPayoutCustomer');
const paymentSheet = require('./service/pay/paymentSheet');
const instantPayoutClient = require('./service/pay/instantPayoutClient');
const addDebitCard = require('./service/pay/addDebitCard');

// APP
const buyApp = require('./service/pay/buyApp');

// Pages
const stripeHostedPage = require('./service/pay/stripeHostedPage');





const stripePostItem = require('./service/pay/postItem');
const createOrder = require('./service/order/create');
const buyLabel = require('./service/order/buyLabel');



AWS.config.update({
  region: 'us-east-1',
});

const endpoints = [

  
  // Buy label
  // {
  //   path: '/chat-gbt',
  //   methods: {
  //     POST: chatgbtAnswer,
  //     GET: chatgbtAnswer,
  //   }
  // },

  {
    path: '/chat-gbt/text-generation',
    methods: {
      POST: textGeneration,
    }
  },

  {
    path: '/chat-gbt/upload-media-and-describe',
    methods: {
      POST: uploadMediaAndDescribe,
    }
  },

  {
    path: '/chat-gbt/write-caption-for-image',
    methods: {
      POST: writeCaptionForImage,
    }
  },


  




  // buy app
  // --------------------------------------------------------
  {
    path: '/pay/buy-app',
    methods: { POST: buyApp.buyApp }
   
  },
  // pay - pushToOwner
  // --------------------------------------------------------
  {
    path: '/pay/stripe-hosted-page',
    methods: { POST: stripeHostedPage.stripeHostedPage }
   
  },
    // pay - pushToOwner
  // --------------------------------------------------------
  {
    path: '/pay/get-account-info',
   methods: { GET: accountInfo.accountInfo }
   
  },
  // pay - pushToOwner
  // --------------------------------------------------------
  {
    path: '/pay/instant-payout-client',
   methods: { POST: instantPayoutClient.instantPayoutClient }
   
  },
  
  // pay - pushToOwner
  // --------------------------------------------------------
  {
    path: '/pay/instant-payout-customer',
   methods: { POST: instantPayoutCustomer.instantPayoutCustomer }
   
  },
   
  // pay - add-debit-card
  // --------------------------------------------------------
  {
    path: '/pay/add-debit-card',
   methods: { POST: addDebitCard.addDebitCard }
   
  },
     
  // pay - paymentSheet
  // --------------------------------------------------------
  {
    path: '/pay/payment-sheet',
   methods: { POST: paymentSheet.paymentSheet }
   
  },
  
  
  



  {
    path: '/create-payment-intent',
    methods: { POST: stripePostItem.postItem }
    // methods: { POST: login }
  },
  
   {
    path: '/order',
    methods: {
      POST: createOrder
    }
  },
  
  // Buy label
  {
    path: '/buy-label',
    methods: {
      POST: buyLabel,
    }
  },
  
];


// Your Lambda function handler
exports.handler = async (event, context) => {
  const { httpMethod, path, queryStringParameters, body } = event;
  let response;

  // Retrieve the appropriate handler function based on the endpoint
  const endpoint = endpoints.find((ep) => ep.path === path);
  if (!endpoint || !endpoint.methods[httpMethod]) {
    return util.buildResponse(404, { error: 'Endpoint not found.' });
  }
  const handlerFunction = endpoint.methods[httpMethod];

  // Parameters 
  const tableName = queryStringParameters && queryStringParameters.tableName;
  const email = queryStringParameters && queryStringParameters.email;
  const speedType = queryStringParameters && queryStringParameters.speedType;
  const order_id = queryStringParameters && queryStringParameters.order_id;
  const store_id = queryStringParameters && queryStringParameters.store_id;
  const projectName = queryStringParameters && queryStringParameters.projectName;
  const projectType = queryStringParameters && queryStringParameters.projectType;
  const destination = queryStringParameters && queryStringParameters.destination ;
  const fileName = queryStringParameters && queryStringParameters.fileName ;
  const owner_id = queryStringParameters && queryStringParameters.owner_id ;
  const domainName = queryStringParameters && queryStringParameters.domainName ;
  const bucketName = queryStringParameters && queryStringParameters.bucketName ;
  
  
  const token = event.headers['Authorization'];


  // Define an array of endpoints where token validation should be skipped
  const endpointsWithoutTokenCheck = [
    '/pay/stripe-hosted-page',
    '/pay/instant-payout-customer',
    '/pay/instant-payout-client',
    '/pay/add-debit-card',
    '/pay/get-account-info',
    '/create-payment-intent',
    '/pay/buy-app',
    '/pay/payment-sheet',
    '/order',
    '/chat-gbt/text-generation',
    '/chat-gbt/upload-media-and-describe',
    '/chat-gbt/write-caption-for-image'
    // '/chat-gbt'
  ];
  
  
  // const endpointsWithoutTokenCheck = ['/product'];

  // Check if the current endpoint is in the array of endpoints to skip
  const skipTokenCheck = endpointsWithoutTokenCheck.includes(path);

  try {
    // If the current endpoint is not in the skip list, perform token validation
    if (!skipTokenCheck) {
      // Extract the token from the event headers


// works !! COMMENTED OUT FOR TESTING AND FASTER DEVELOPMENT
      if (!token) {
        return {
          statusCode: 401,
          // body: JSON.stringify({ message: 'Unauthorized Access - 2' }),
          body: JSON.stringify({ message: 'Missing token' }),
        };
      }

      // Verify the JWT token
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const email = decoded.email;

        // Check if the user exists (replace with your userExists function)
        const persistedUser = userExists(email);

        if (!persistedUser) {
          return {
            statusCode: 403,
            body: JSON.stringify({ message: 'User not found End' }),
          };
        }
        
        // Store the token in req.session -- ADD BACK ??
       // event.req.session.token = token

        // If authentication is successful, you can access the authenticated user's email
        // and continue processing the Lambda function logic.
        const authenticatedEmail = email;


      } catch (error) {
        return {
          statusCode: 401,
          // body: JSON.stringify({ message: "You dont fu*king have access" }),
          body: JSON.stringify({ message: 'Unauthorized Access token' }),
          
         
        };
      }
    }

    // Run code if Verified
      
  switch (httpMethod) {
    case 'GET':
         response = await handlerFunction(email);
   //    response = util.buildResponse(404, '404 Not Found');
     
      break;
    case 'POST': 
      

      if (path === "/pay/add-debit-card"){
          response = await handlerFunction(JSON.parse(body), email);
          // response = await handlerFunction(JSON.parse(body));
          // response = await handlerFunction((JSON.parse(body), email, cardNumber, expMonth, expYear, cvc);

      } else if (path === '/chat-gbt/text-generation') {
        response = await handlerFunction(JSON.parse(body));

      } else if (path === '/chat-gbt/upload-media-and-describe') {
        response = await handlerFunction(body, destination , fileName);
        // response = util.buildResponse(304, '404 Not Found (but u did ;)');
      

      }  else if (path === '/chat-gbt/write-caption-for-image') {
        response = await handlerFunction(body);
        // response = util.buildResponse(304, '404 Not Found (but u did ;)');
      

      }  else if (path === '/buy-label') {
       response = await handlerFunction(order_id, store_id, tableName);
      
      }  else if (path === '/pay/buy-app') {
       response = await handlerFunction(projectName, projectType, store_id);
        // response = util.buildResponse(404, '404 Not Found (but u did ;)');
     
      } else if (path === '/order') {
        response = await handlerFunction(JSON.parse(body), tableName);

      } else if (path === '/create-payment-intent') {
        response = await handlerFunction(JSON.parse(body));
      
      } else if (path === '/pay/payment-sheet') {
        response = await handlerFunction(JSON.parse(body));
      // response = util.buildResponse(404, 'working...');
      } else if (path === '/pay/stripe-hosted-page') {
      //  response = await handlerFunction(JSON.parse(body));
                response = await handlerFunction(JSON.parse(body), store_id);


      } else { // Pay
        //   response = util.buildResponse(404, '404 Not Found');
        response = await handlerFunction(email, speedType);
      }
      break;
    case 'PATCH':
       response = util.buildResponse(404, '404 Not Found');

      break;
    case 'DELETE':
   
      response = util.buildResponse(404, '404 Not Found');
      
      break;
    default:
      response = util.buildResponse(404, '404 Not Found');
  }



    // Return the response
    return response;
    
    
    
  } catch (error) {
    // Handle any other errors that may occur during processing.
    return {
      statusCode: 500,
      // body: JSON.stringify({ message: 'Internal Server Error', error: `ERROR accuring outside of any of your case : ${error.message}` }),
      body: JSON.stringify( `Server under maintenance, please try again later` ),
    };
  };
};


// 1.  check if user exisit 
// 2.  check if product store_id mattch user.Item.store_id match - only pull that data that matches

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

async function healthCheck() {
  return util.buildResponse(200, { status: 'OK' });
}



/*
// Intergrate if "Unexpected token I in JSON at position 0" error happens again
// maybe uploading an image doesnt finsih in time to update dynomodb and messes up everything 
// for now - fix by adding completion handler to wait for one to finish first



exports.handler = async (event) => {
    const { httpMethod, headers, body } = event;

    const contentType = headers['Content-Type'];

    if (contentType === 'application/json') {
        // Parse the JSON body
        const jsonData = JSON.parse(body);

        // Handle JSON data here
        // ...

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'JSON data received' }),
        };
    } else if (contentType.startsWith('image/')) {
        // Handle binary data here
        // ...

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Binary data received' }),
        };
    } else {
        // Handle unsupported content types or other cases
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Unsupported content type' }),
        };
    }
};

*/