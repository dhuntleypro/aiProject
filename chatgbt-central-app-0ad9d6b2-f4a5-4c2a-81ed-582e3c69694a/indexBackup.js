// const webhook = require('./webhook/postItem');
// const configService = require('./utils/config');
const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY;

const appService = require('./app/create');


const registerService = require('./service/user/register');
const loginService = require('./service/user/login');
const verifyService = require('./service/verify');
// const emailService = require('./service/email/sendMail');
// 

// Dynamo
const dynamoCreateService = require('./dynamo/create');



// flexible
// const flexibleDeleteService = require('./flexible/deleteItem');
// const flexibleGetService = require('./flexible/getItem');
// const flexiblePatchService = require('./flexible/patchItem');
// const flexiblePostService = require('./flexible/postItem');
// const flexiblesGetService = require('./flexible/getItems');


const stripeAccountLinkService = require('./stripe/accountLink');
const stripeAccountService = require('./stripe/accounts');
const stripePostService = require('./stripe/postItem');
const stripeCheckoutService = require('./stripe/checkout');

const util = require('./utils/util'); 

// Articles
const articleDeleteService = require('./service/article/deleteItem');
const articleGetService = require('./service/article/getItem');
const articlePatchService = require('./service/article/patchItem');
const articlePostService = require('./service/article/postItem');
const articlesGetService = require('./service/article/getItems');

 
// Calendar
const calendarDeleteService = require('./service/calendar/deleteItem');
const calendarGetService = require('./service/calendar/getItem');
const calendarPatchService = require('./service/calendar/patchItem');
const calendarPostService = require('./service/calendar/postItem');
const calendarsGetService = require('./service/calendar/getItems');


// MT4
const candleDeleteService = require('./service/candle/deleteItem');
const candleGetService = require('./service/candle/getItem');
const candlePatchService = require('./service/candle/patchItem');
const candlePostService = require('./service/candle/postItem');
const candlesGetService = require('./service/candle/getItems');

// Collections
const collectionDeleteService = require('./service/collection/deleteItem');
const collectionGetService = require('./service/collection/getItem');
const collectionPatchService = require('./service/collection/patchItem');
const collectionPostService = require('./service/collection/postItem');
const collectionsGetService = require('./service/collection/getItems');

// Documentation
const documentationDeleteService = require('./service/documentation/deleteItem');
const documentationGetService = require('./service/documentation/getItem');
const documentationPatchService = require('./service/documentation/patchItem');
const documentationPostService = require('./service/documentation/postItem');
const documentationsGetService = require('./service/documentation/getItems');


// Expense
const expenseDeleteService = require('./service/expense/deleteItem');
const expenseDeleteAllService = require('./service/expense/deleteAllItem');
const expenseGetService = require('./service/expense/getItem');
const expensePatchService = require('./service/expense/patchItem');
const expensePostService = require('./service/expense/postItem');
const expensePostAllService = require('./service/expense/postAllItem');
const expensesGetService = require('./service/expense/getItems');



// Notification
const notificationDeleteService = require('./service/notification/deleteItem');
const notificationGetService = require('./service/notification/getItem');
const notificationPatchService = require('./service/notification/patchItem');
const notificationPostService = require('./service/notification/postItem');
const notificationsGetService = require('./service/notification/getItems');
const notificationsTitleGetService = require('./service/notification/getTitles');

// Order
const orderDeleteService = require('./service/order/deleteItem');
const orderGetService = require('./service/order/getItem');
const orderPatchService = require('./service/order/patchItem');
const orderPostService = require('./service/order/postItem');
const ordersGetService = require('./service/order/getItems');
const ordersTitleGetService = require('./service/order/getTitles');

// Product
const productDeleteService = require('./service/product/deleteItem');
const productGetService = require('./service/product/getItem');
const productPatchService = require('./service/product/patchItem');
const productPostService = require('./service/product/postItem');
const productsGetService = require('./service/product/getItems');


// Slice
const sliceDeleteService = require('./service/slice/deleteItem');
const sliceGetService = require('./service/slice/getItem');
const slicePatchService = require('./service/slice/patchItem');
const slicePostService = require('./service/slice/postItem');
const slicesPostService = require('./service/slice/postItems');
const slicesGetService = require('./service/slice/getItems');

// Store
const storeDeleteService = require('./service/store/deleteItem');
const storeGetService = require('./service/store/getItem');
const storePatchService = require('./service/store/patchItem');
const storePostService = require('./service/store/postItem');
const storesGetService = require('./service/store/getItems');

// Subscriber
const subscriberDeleteService = require('./service/subscriber/deleteItem');
const subscriberGetService = require('./service/subscriber/getItem');
const subscriberPatchService = require('./service/subscriber/patchItem');
const subscriberPostService = require('./service/subscriber/postItem');
const subscribersGetService = require('./service/subscriber/getItems');

// Subscription
const subscriptionDeleteService = require('./service/subscription/deleteItem');
const subscriptionGetService = require('./service/subscription/getItem');
const subscriptionPatchService = require('./service/subscription/patchItem');
const subscriptionPostService = require('./service/subscription/postItem');
const subscriptionsGetService = require('./service/subscription/getItems');

// Support
const supportDeleteService = require('./service/support/deleteItem');
const supportGetService = require('./service/support/getItem');
const supportPatchService = require('./service/support/patchItem');
const supportPostService = require('./service/support/postItem');
const supportsGetService = require('./service/support/getItems');

// Task
const taskDeleteService = require('./service/task/deleteItem');
const tasksDeleteService = require('./service/task/deleteItems');
const taskGetService = require('./service/task/getItem');
const taskPatchService = require('./service/task/patchItem');
const taskPostService = require('./service/task/postItem');
const tasksPostService = require('./service/task/postItems');
const tasksGetService = require('./service/task/getItems');


// Temps
const tempDeleteService = require('./service/temp/deleteItem');
const tempGetService = require('./service/temp/getItem');
const tempPatchService = require('./service/temp/patchItem');
const tempPostService = require('./service/temp/postItem');
const tempsGetService = require('./service/temp/getItems');

// testimonial
const testimonialDeleteService = require('./service/testimonial/deleteItem');
const testimonialGetService = require('./service/testimonial/getItem');
const testimonialPatchService = require('./service/testimonial/patchItem');
const testimonialPostService = require('./service/testimonial/postItem');
const testimonialsGetService = require('./service/testimonial/getItems');

// Todo
const todoDeleteService = require('./service/todo/deleteItem');
const todoGetService = require('./service/todo/getItem');
const todoPatchService = require('./service/todo/patchItem');
const todoPostService = require('./service/todo/postItem');
const todosGetService = require('./service/todo/getItems');

// User
const userDeleteService = require('./service/user/deleteItem');
const userGetService = require('./service/user/getItem');
const userPatchService = require('./service/user/patchItem');
const userPostService = require('./service/user/postItem');
const usersGetService = require('./service/user/getItems');






const AWS = require('aws-sdk');
AWS.config.update({
  region: 'us-east-1',
});

const webhookPath = '/webhook';
const configPath = '/config';


const healthPath = '/health';
const verifyPath = '/verify';
const registerPath = '/register';
const loginPath = '/login';
const resetPasswordPath = '/reset-password';
// const emailPath = '/sendmail';


///////////////////////////////////////////////////////////////////////////////////

const dynamodbCreatePath = '/dynamodb/create';
const appPath = '/app/development';


// Stripe 
const stripePath = '/create-payment-intent';
const stripeAccountsPath = '/stripe/accounts';
const stripeCheckoutPath = '/checkout';
const stripeAccountLinkPath = '/stripe/account-link';


///////////////////////////////////////////////////////////////////////////////////

// Articles
const articlePath = '/article';
const articlesPath = '/articles';

// Candle
const candlePath = '/candle';
const candlesPath = '/candles';


// Calendar
const calendarPath = '/calendar';
const calendarsPath = '/calendars';

// Collection
const collectionPath = '/collection';
const collectionsPath = '/collections';



// Documentation
const documentationPath = '/documentation';
const documentationsPath = '/documentations';


// Expense
const expensePath = '/expense';
const expensesPath = '/expenses';

// Notification
const notificationPath = '/notification';
const notificationsPath = '/notifications';

// Order
const orderPath = '/order';
const ordersPath = '/orders';
const ordersTitlePath = '/titles/orders';

// Product
const productPath = '/product';
const productsPath = '/products';

// Temp
const tempPath = '/temp';
const tempsPath = '/temps';

// Slice
const slicePath = '/slice';
const slicesPath = '/slices';

// Store
const storePath = '/store';
const storesPath = '/stores';

// Subscriber
const subscriberPath = '/subscriber';
const subscribersPath = '/subscribers';

// Subscription
const subscriptionPath = '/subscription';
const subscriptionsPath = '/subscriptions';

// Support
const supportPath = '/support';
const supportsPath = '/supports';

// Task
const taskPath = '/task';
const tasksPath = '/tasks';


// Testimonial
const testimonialPath = '/testimonial';
const testimonialsPath = '/testimonials';

// Todo
const todoPath = '/todo';
const todosPath = '/todos';

// User
const userPath = '/user';
const usersPath = '/users';















exports.handler = async function (event) {
  console.log('Request Event: ', event);
  let response;

  switch (true) {
    
    // // Web hook
    case event.httpMethod === 'POST' && event.path === webhookPath:
      response = util.buildResponse(200);
    break;
    

    
    // Config
    case event.httpMethod === 'GET' && event.path === configPath:
        // const ConfigBody = JSON.parse(event.body);
        // response = await configService.getItem(ConfigBody);
        //  response = util.buildResponse(200);
        const output = { publishableKey: publishableKey };
      
        response = util.buildResponse(200, output);
        break;
    
    // App -- // create endpoints
    case event.httpMethod === 'POST' && event.path === appPath:
      const appBody = JSON.parse(event.body);
      response = await appService.create(appBody);
      break;
      
    // App have user send a post request
  //  case event.httpMethod === 'POST'  && event.path === appPath:
  //    const appBody = JSON.parse(event.body);
   //   response = await appService.create(appBody);
  //    break;
      
      
      
      
      
      
    
    // Health
    case event.httpMethod === 'GET' && event.path === healthPath:
      response = util.buildResponse(200);
      break;

    // Register
    case event.httpMethod === 'POST' && event.path === registerPath:
      const registerBody = JSON.parse(event.body);
      response = await registerService.register(registerBody);
      break;

    // Login
    case event.httpMethod === 'POST' && event.path === loginPath:
      const loginBody = JSON.parse(event.body);
      response = loginService.login(loginBody);
      break;

    // Verify
    case event.httpMethod === 'POST' && event.path === verifyPath:
      const verifyBody = JSON.parse(event.body);
      response = verifyService.verify(verifyBody);
      break;
      
    // // Reset Password
    // case event.httpMethod === 'POST' && event.path === resetPasswordPath:
    //   const resetPasswordBody = JSON.parse(event.body);
    //   response = await registerService.register(registerBody);
    //   break;
    
    
    case event.httpMethod === 'GET' && event.path === resetPasswordPath:
      response = util.buildResponse(200);
      break;
    
  /////////////////////////////////////////////////////////////////////////////////////////////////
   
    // Dynamo Table - create
    case event.httpMethod === 'POST' && event.path === stripePath:
        const requestDynamoBody = JSON.parse(event.body);
        response = await dynamoCreateService.create(requestDynamoBody); // Pass the whole requestStripeBody object.
    break;



  
  ///////////////////////////////////////////////////////////////////////////////////////////////
  
  
  
  
  
  
  
  
  
  
      // stripe - Single Payment
      case event.httpMethod === 'POST' && event.path === dynamodbCreatePath:
        const requestDynamodbBody = JSON.parse(event.body);
        response = await stripePostService.postItem(requestDynamodbBody); // Pass the whole requestStripeBody object.
      break;

      
     // stripe - Subscription Payment
      case event.httpMethod === 'POST' && event.path === stripeCheckoutPath:
        const requestCheckoutStripeBody = JSON.parse(event.body);
        response = await stripeCheckoutService.checkout(requestCheckoutStripeBody); // Pass the whole requestStripeBody object.
    // response = util.buildResponse(200);
      break;
      
         
     // stripe - Create Account 
      case event.httpMethod === 'POST' && event.path === stripeAccountsPath:
        const requestAccountStripeBody = JSON.parse(event.body);
        response = await stripeAccountService.accounts(requestAccountStripeBody); // Pass the whole requestStripeBody object.
    // response = util.buildResponse(200);
      break;
      
     // stripe - Create New Account Link
      case event.httpMethod === 'POST' && event.path === stripeAccountLinkPath:
        const requestAccountLinkStripeBody = JSON.parse(event.body);
        response = await stripeAccountLinkService.accountLink(requestAccountLinkStripeBody); // Pass the whole requestStripeBody object.
    // response = util.buildResponse(200);
      break;



    
//     // Email
       
//       // Get
//       case event.httpMethod === 'GET' && event.path === emailPath:
//         response = util.buildResponse(200);
//         break;

//       // Post
//       case event.httpMethod === 'POST' && event.path === emailPath:
//         const emailBody = JSON.parse(event.body);
//         response = emailService.handler(emailBody);
//         // response = emailService.handler();
//         // response = util.buildResponse(200);
//         break;


// Articles 


    // Articles - GET
    case event.httpMethod === 'GET' && event.path === articlePath:
      response = await articleGetService.getItem(
        event.queryStringParameters.id
      );
      break;

    // Articles - GET all
    case event.httpMethod === 'GET' && event.path === articlesPath:
      response = await articlesGetService.getItems();
      break;

    // Articles - POST
    case event.httpMethod === 'POST' && event.path === articlePath:
      const articleBody = JSON.parse(event.body);
      response = await articlePostService.postItem(articleBody);
      break;

    // Articles - PATCH
    case event.httpMethod === 'PATCH' && event.path === articlePath:
      const requestArticleBody = JSON.parse(event.body);
      response = await articlePatchService.patchItem(
        requestArticleBody.id,
        requestArticleBody.updateKey,
        requestArticleBody.updateValue
      );
      break; 

    // Articles - DELETE
    case event.httpMethod === 'DELETE' && event.path === articlePath:
      response = await articleDeleteService.deleteItem(
        event.queryStringParameters.id
      );
      break;


// Calendar 


    // Calendar - GET
    case event.httpMethod === 'GET' && event.path === calendarPath:
      response = await calendarGetService.getItem(
        event.queryStringParameters.id
      );
      break;

    // Calendar - GET all
    case event.httpMethod === 'GET' && event.path === calendarsPath:
      response = await calendarsGetService.getItems();
      break;

    // Calendar - POST
    case event.httpMethod === 'POST' && event.path === calendarPath:
      const calendarBody = JSON.parse(event.body);
      response = await calendarPostService.postItem(calendarBody);
      break;

    // Calendar - PATCH
    case event.httpMethod === 'PATCH' && event.path === calendarPath:
      const requestCalendarBody = JSON.parse(event.body);
      response = await calendarPatchService.patchItem(
        requestCalendarBody.id,
        requestCalendarBody.updateKey,
        requestCalendarBody.updateValue
      );
      break;

    // Calendar - DELETE
    case event.httpMethod === 'DELETE' && event.path === calendarPath:
      response = await calendarDeleteService.deleteItem(
        event.queryStringParameters.id
      );
      break;





// Candle 


    // Candle - GET
    case event.httpMethod === 'GET' && event.path === candlePath:
      response = await candleGetService.getItem(
        event.queryStringParameters.id
      );
      break;

    // Candle - GET all
    case event.httpMethod === 'GET' && event.path === candlesPath:
      response = await candlesGetService.getItems();
      break;

    // Candle - POST
    case event.httpMethod === 'POST' && event.path === candlePath:
      const candleBody = JSON.parse(event.body);
      response = await candlePostService.postItem(candleBody);
      break;

    // Candle - PATCH
    case event.httpMethod === 'PATCH' && event.path === candlePath:
      const requestCandleBody = JSON.parse(event.body);
      response = await candlePatchService.patchItem(
        requestCandleBody.id,
        requestCandleBody.updateKey,
        requestCandleBody.updateValue
      );
      break; 

    // Candle - DELETE
    case event.httpMethod === 'DELETE' && event.path === candlePath:
      response = await candleDeleteService.deleteItem(
        event.queryStringParameters.id
      );
      break;



// Collection 


    // Collection - GET
    case event.httpMethod === 'GET' && event.path === collectionPath:
      response = await collectionGetService.getItem(
        event.queryStringParameters.id
      );
      break;

    // Collection - GET all
    case event.httpMethod === 'GET' && event.path === collectionsPath:
      response = await collectionsGetService.getItems();
      break;

    // Collection - POST
    case event.httpMethod === 'POST' && event.path === collectionPath:
      const collectionBody = JSON.parse(event.body);
      response = await collectionPostService.postItem(collectionBody);
      break;

    // Collection - PATCH
    case event.httpMethod === 'PATCH' && event.path === collectionPath:
      const requestCollectionBody = JSON.parse(event.body);
      response = await collectionPatchService.patchItem(
        requestCollectionBody.id,
        requestCollectionBody.updateKey,
        requestCollectionBody.updateValue
      );
      break; 

    // Collection - DELETE
    case event.httpMethod === 'DELETE' && event.path === collectionPath:
      response = await collectionDeleteService.deleteItem(
        event.queryStringParameters.id
      );
      break;




// Documentation 


    // Documentation - GET
    case event.httpMethod === 'GET' && event.path === documentationPath:
      response = await documentationGetService.getItem(
        event.queryStringParameters.id
      );
      break;

    // Documentation - GET all
    case event.httpMethod === 'GET' && event.path === documentationsPath:
      response = await documentationsGetService.getItems();
      break;

    // Documentation - POST
    case event.httpMethod === 'POST' && event.path === documentationPath:
      const documentationBody = JSON.parse(event.body);
      response = await documentationPostService.postItem(documentationBody);
      break;

    // Documentation - PATCH
    case event.httpMethod === 'PATCH' && event.path === documentationPath:
      const requestDocumentationBody = JSON.parse(event.body);
      response = await documentationPatchService.patchItem(
        requestDocumentationBody.id,
        requestDocumentationBody.updateKey,
        requestDocumentationBody.updateValue
      );
      break; 

    // Documentation - DELETE
    case event.httpMethod === 'DELETE' && event.path === documentationPath:
      response = await documentationDeleteService.deleteItem(
        event.queryStringParameters.id
      );
      break;

// Expense 


    // Expense - GET
    case event.httpMethod === 'GET' && event.path === expensePath:
      response = await expenseGetService.getItem(
        event.queryStringParameters.id
      );
      break;

    // Expense - GET all
    case event.httpMethod === 'GET' && event.path === expensesPath:
      response = await expensesGetService.getItems();
      break;

    // Expense - POST
    case event.httpMethod === 'POST' && event.path === expensePath:
      const expenseBody = JSON.parse(event.body);
      response = await expensePostService.postItem(expenseBody);
      break;
      
  // Expense - POST ALL
    case event.httpMethod === 'POST' && event.path === expensePath:
      const expenseAllBody = JSON.parse(event.body);
      response = await expensePostAllService.postAllItem(expenseAllBody);
      break;

    // Expense - PATCH
    case event.httpMethod === 'PATCH' && event.path === expensePath:
      const requestExpenseBody = JSON.parse(event.body);
      response = await expensePatchService.patchItem(
        requestExpenseBody.id,
        requestExpenseBody.updateKey,
        requestExpenseBody.updateValue
      );
      break;

    // Expense - DELETE
    case event.httpMethod === 'DELETE' && event.path === expensePath:
      response = await expenseDeleteService.deleteItem(
        event.queryStringParameters.id
      );
      break;

  // Expense - DELETE ALL
    case event.httpMethod === 'DELETE' && event.path === expensePath:
      const expenseDAllBody = JSON.parse(event.body);

      response = await expenseDeleteAllService.deleteAllItem(
        // event.queryStringParameters.id
        expenseDAllBody
      );
      break;

// Notification



// Notification - GET
    case event.httpMethod === 'GET' && event.path === notificationPath:
      response = await notificationGetService.getItem(
        event.queryStringParameters.id
      );
      break;

    // Notification - GET all
    case event.httpMethod === 'GET' && event.path === notificationsPath:
      response = await notificationsGetService.getItems();
      break;

    // Notification - POST
    case event.httpMethod === 'POST' && event.path === notificationPath:
      const notificationBody = JSON.parse(event.body);
      response = await notificationPostService.postItem(notificationBody);
      break;

    // Notification - PATCH
    case event.httpMethod === 'PATCH' && event.path === notificationPath:
      const requestNotificationBody = JSON.parse(event.body);
      response = await notificationPatchService.patchItem(
        requestNotificationBody.id,
        requestNotificationBody.updateKey,
        requestNotificationBody.updateValue
      );
      break;

    // Notification - DELETE
    case event.httpMethod === 'DELETE' && event.path === notificationPath:
      response = await notificationDeleteService.deleteItem(
        event.queryStringParameters.id
      );
      break;






// Order



// Order - GET TITLES
    case event.httpMethod === 'GET' && event.path === ordersTitlePath:
      response = await ordersTitleGetService.getTitles();
      // response = util.buildResponse(200);
      break;

// Order - GET
    case event.httpMethod === 'GET' && event.path === orderPath:
      response = await orderGetService.getItem(
        event.queryStringParameters.id
      );
      break;

    // Order - GET all
    case event.httpMethod === 'GET' && event.path === ordersPath:
      response = await ordersGetService.getItems();
      break;

    // Order - POST
    case event.httpMethod === 'POST' && event.path === orderPath:
      const orderBody = JSON.parse(event.body);
      response = await orderPostService.postItem(orderBody);
      break;

    // Order - PATCH
    case event.httpMethod === 'PATCH' && event.path === orderPath:
      const requestOrderBody = JSON.parse(event.body);
      response = await orderPatchService.patchItem(
        requestOrderBody.id,
        requestOrderBody.updateKey,
        requestOrderBody.updateValue
      );
      break;

    // Order - DELETE
    case event.httpMethod === 'DELETE' && event.path === orderPath:
      response = await orderDeleteService.deleteItem(
        event.queryStringParameters.id
      );
      break;






// Product




    // Product - GET
    case event.httpMethod === 'GET' && event.path === productPath:
      response = await productGetService.getItem(
        event.queryStringParameters.id
      );
      break;

    // Products - GET all
    case event.httpMethod === 'GET' && event.path === productsPath:
      response = await productsGetService.getItems();
      break;

    // Product - POST
    case event.httpMethod === 'POST' && event.path === productPath:
      const productBody = JSON.parse(event.body);
      response = await productPostService.postItem(productBody);
      break;
      
      


    // // Products - POST
    // case event.httpMethod === 'POST' && event.path === productsPath:
    //   const productsBody = JSON.parse(event.body);
    //   response = await productsPostService.postItems(productsBody);
    //   break;

      
          // Product - PATCH
    case event.httpMethod === 'PATCH' && event.path === productPath:
      const requestProductBody = JSON.parse(event.body);
      response = await productPatchService.patchItem(
        requestProductBody.id,
        requestProductBody.updateKey,
        requestProductBody.updateValue
      );
      break;

    // Product - DELETE
    case event.httpMethod === 'DELETE' && event.path === productPath:
      response = await productDeleteService.deleteItem(
        event.queryStringParameters.id
      );
      break;




// Slice
 
 
    // Slice - GET
    case event.httpMethod === 'GET' && event.path === slicePath:
      response = await sliceGetService.getItem(
        event.queryStringParameters.id
      );
      break;

    // Slice - GET all
    case event.httpMethod === 'GET' && event.path === slicesPath:
      response = await slicesGetService.getItems();
      break;

    // Slice - POST
    case event.httpMethod === 'POST' && event.path === slicePath:
      const sliceBody = JSON.parse(event.body);
      response = await slicePostService.postItem(sliceBody);
      break;
      
    // Slices - POST
    case event.httpMethod === 'POST' && event.path === slicesPath:
      // const slicesBody = JSON.parse(event.body);
      // response = await slicesPostService.postItems(slicesBody);
      response = await slicesPostService.postItems();

      break;

    // Slice - PATCH
    case event.httpMethod === 'PATCH' && event.path === slicePath:
      const requestSliceBody = JSON.parse(event.body);
      response = await slicePatchService.patchItem(
        requestSliceBody.id,
        requestSliceBody.updateKey,
        requestSliceBody.updateValue
      );
      break;

    // Slice - DELETE
    case event.httpMethod === 'DELETE' && event.path === slicePath:
      response = await sliceDeleteService.deleteItem(
        event.queryStringParameters.id
      );
      break;
      
      
      
      
      

// Store 





    // Store - GET
    case event.httpMethod === 'GET' && event.path === storePath:
      response = await storeGetService.getItem(
        event.queryStringParameters.id
      );
      break;

    // store - GET all
    case event.httpMethod === 'GET' && event.path === storesPath:
      response = await storesGetService.getItems();
      break;

    // store - POST
    case event.httpMethod === 'POST' && event.path === storePath:
      const storeBody = JSON.parse(event.body);
      response = await storePostService.postItem(storeBody);
      break;

    // store - PATCH
    case event.httpMethod === 'PATCH' && event.path === storePath:
      const requestStoreBody = JSON.parse(event.body);
      response = await storePatchService.patchItem(
        requestStoreBody.id,
        requestStoreBody.updateKey,
        requestStoreBody.updateValue
      );
      break;

    // store - DELETE
    case event.httpMethod === 'DELETE' && event.path === storePath:
      response = await storeDeleteService.deleteItem(
        event.queryStringParameters.id
      );
      break;






// subscriber



    // Subscriber - GET
    case event.httpMethod === 'GET' && event.path === subscriberPath:
      response = await subscriberGetService.getItem(
        event.queryStringParameters.id
      );
      break;

    // Subscribers - GET all
    case event.httpMethod === 'GET' && event.path === subscribersPath:
      response = await subscribersGetService.getItems();
      break;

    // Subscriber - POST
    case event.httpMethod === 'POST' && event.path === subscriberPath:
      const subscriberBody = JSON.parse(event.body);
      response = await subscriberPostService.postItem(subscriberBody);
      break;

    // Subscriber - PATCH
    case event.httpMethod === 'PATCH' && event.path === subscriberPath:
      const requestSubscriberBody = JSON.parse(event.body);
      response = await subscriberPatchService.patchItem(
        requestSubscriberBody.id,
        requestSubscriberBody.updateKey,
        requestSubscriberBody.updateValue
      );
      break;

    // Subscriber - DELETE
    case event.httpMethod === 'DELETE' && event.path === subscriberPath:
      response = await subscriberDeleteService.deleteItem(event.queryStringParameters.email);
      break;
      
      // response = util.buildResponse(200);
      // break;


    // subscription
 

    // subscription - GET
    case event.httpMethod === 'GET' && event.path === subscriptionPath:
      response = await subscriptionGetService.getItem(
        event.queryStringParameters.id
      );
      break;

    // Subscription - GET all
    case event.httpMethod === 'GET' && event.path === subscriptionsPath:
      response = await subscriptionsGetService.getItems();
      break;

    // Subscription - POST
    case event.httpMethod === 'POST' && event.path === subscriptionPath:
      const subscriptionBody = JSON.parse(event.body);
      response = await subscriptionPostService.postItem(subscriptionBody);
      break;

    // Subscription - PATCH
    case event.httpMethod === 'PATCH' && event.path === subscriptionPath:
      const requestSubscriptionBody = JSON.parse(event.body);
      response = await subscriptionPatchService.patchItem(
        requestSubscriptionBody.id,
        requestSubscriptionBody.updateKey,
        requestSubscriptionBody.updateValue
      );
      break;

    // Subscription - DELETE
    case event.httpMethod === 'DELETE' && event.path === subscriptionPath:
      response = await subscriptionDeleteService.deleteItem(
        event.queryStringParameters.id
      );
      break;






  


// Support


    // Support - GET
    case event.httpMethod === 'GET' && event.path === supportPath:
      response = await supportGetService.getItem(
        event.queryStringParameters.id
      );
      break;

    // Support - GET all
    case event.httpMethod === 'GET' && event.path === supportsPath:
      response = await supportsGetService.getItems();
      break;

    // Support - POST
    case event.httpMethod === 'POST' && event.path === supportPath:
      const supportBody = JSON.parse(event.body);
      response = await supportPostService.postItem(supportBody);
      break;

    // Support - PATCH
    case event.httpMethod === 'PATCH' && event.path === supportPath:
      const requestSupportBody = JSON.parse(event.body);
      response = await supportPatchService.patchItem(
        requestSupportBody.id,
        requestSupportBody.updateKey,
        requestSupportBody.updateValue
      );
      break;
      
      
    // Support - DELETE
    case event.httpMethod === 'DELETE' && event.path === supportPath:
      response = await supportDeleteService.deleteItem(
        event.queryStringParameters.id
      );
      break;
      
      
      








      
      
      
// Task



    // Task - GET
    case event.httpMethod === 'GET' && event.path === taskPath:
      response = await taskGetService.getItem(
        event.queryStringParameters.id
      );
      break;

    // Task - GET all
    case event.httpMethod === 'GET' && event.path === tasksPath:
      response = await tasksGetService.getItems();
      break;

    // Task - POST
    case event.httpMethod === 'POST' && event.path === taskPath:
      const taskBody = JSON.parse(event.body);
      response = await taskPostService.postItem(taskBody);
      break;

  // Task - POST All
    case event.httpMethod === 'POST' && event.path === tasksPath:
      const taskPostBody = JSON.parse(event.body);
      response = await tasksPostService.postItems(taskPostBody);
      
      // response = util.buildResponse(200);
     
      break;

    // Task - PATCH
    case event.httpMethod === 'PATCH' && event.path === taskPath:
      const requestTaskBody = JSON.parse(event.body);
      response = await taskPatchService.patchItem(
        requestTaskBody.id,
        requestTaskBody.updateKey,
        requestTaskBody.updateValue
      );
      break;

    // Task - DELETE
    case event.httpMethod === 'DELETE' && event.path === taskPath:
      response = await taskDeleteService.deleteItem(
        event.queryStringParameters.id
      );
      break;
      
      // Task - DELETE ALL
    case event.httpMethod === 'DELETE' && event.path === tasksPath:
      response = await tasksDeleteService.deleteItems();
      break;
      //   response = util.buildResponse(200);
      // break;

    // // Task - DELETE All
    // case event.httpMethod === 'DELETE' && event.path === tasksPath:
    // const taskDeleteBody = JSON.parse(event.body);
    //   response = await tasksDeleteService.deleteItems(taskDeleteBody);
     

    //   break;







// Temp


    // Temp - GET
    case event.httpMethod === 'GET' && event.path === tempPath:
      response = await tempGetService.getItem(
        event.queryStringParameters.id
      );
      break;

    // Temp - GET all
    case event.httpMethod === 'GET' && event.path === tempsPath:
      response = await tempsGetService.getItems();
      break;

    // Temp - POST
    case event.httpMethod === 'POST' && event.path === tempPath:
      const tempBody = JSON.parse(event.body);
      response = await tempPostService.postItem(tempBody);
      break;

    // Temp - PATCH
    case event.httpMethod === 'PATCH' && event.path === tempPath:
      const requestTempBody = JSON.parse(event.body);
      response = await tempPatchService.patchItem(
        requestTempBody.id,
        requestTempBody.updateKey,
        requestTempBody.updateValue
      );
      break;
      
      
    // Temp - DELETE
    case event.httpMethod === 'DELETE' && event.path === tempPath:
      response = await tempDeleteService.deleteItem(
        event.queryStringParameters.id
      );
      break;
      
      
      











// Testimonial

    // Testimonial - GET
    case event.httpMethod === 'GET' && event.path === testimonialPath:
      response = await testimonialGetService.getItem(
        event.queryStringParameters.id
      );
      break;

    // Testimonial - GET all
    case event.httpMethod === 'GET' && event.path === testimonialsPath:
      response = await testimonialsGetService.getItems();
      break;

    // Testimonial - POST
    case event.httpMethod === 'POST' && event.path === testimonialPath:
      const testimonialBody = JSON.parse(event.body);
      response = await testimonialPostService.postItem(testimonialBody);
      break;

    // Testimonial - PATCH
    case event.httpMethod === 'PATCH' && event.path === testimonialPath:
      const requestTestimonialBody = JSON.parse(event.body);
      response = await testimonialPatchService.patchItem(
        requestTestimonialBody.id,
        requestTestimonialBody.updateKey,
        requestTestimonialBody.updateValue
      );
      break;

    // Testimonial - DELETE
    case event.httpMethod === 'DELETE' && event.path === testimonialPath:
      response = await testimonialDeleteService.deleteItem(
        event.queryStringParameters.id
      );
      break;




// Todo



    // Todo - GET
    case event.httpMethod === 'GET' && event.path === todoPath:
      response = await todoGetService.getItem(
        event.queryStringParameters.id
      );
      break;

    // Todo - GET all
    case event.httpMethod === 'GET' && event.path === todosPath:
      response = await todosGetService.getItems();
      break;

    // Todo - POST
    case event.httpMethod === 'POST' && event.path === todoPath:
      const todoBody = JSON.parse(event.body);
      response = await todoPostService.postItem(todoBody);
      break;

    // Todo - PATCH
    case event.httpMethod === 'PATCH' && event.path === todoPath:
      const requestTodoBody = JSON.parse(event.body);
      response = await todoPatchService.patchItem(
        requestTodoBody.id,
        requestTodoBody.updateKey,
        requestTodoBody.updateValue
      );
      break;

    // Todo - DELETE
    case event.httpMethod === 'DELETE' && event.path === todoPath:
      response = await todoDeleteService.deleteItem(
        event.queryStringParameters.id
      );
      break;






// User



    // User - GET
    case event.httpMethod === 'GET' && event.path === userPath:
      response = await userGetService.getUser(
        event.queryStringParameters.id
      );
      break;

    // Users - GET all
    case event.httpMethod === 'GET' && event.path === usersPath:
      response = await usersGetService.getItems();
      break;

    // User - POST
    case event.httpMethod === 'POST' && event.path === userPath:
      const userBody = JSON.parse(event.body);
      response = await userPostService.postItem(userBody);
      break;


      // User - PATCH
    case event.httpMethod === 'PATCH' && event.path === userPath:
      const requestUserBody = JSON.parse(event.body);
      response = await userPatchService.patchItem(
        requestUserBody.email,
        requestUserBody.updateKey,
        requestUserBody.updateValue
      );
      break;

      
    // User - DELETE
    case event.httpMethod === 'DELETE' && event.path === userPath:
      response = await userDeleteService.deleteItem(
        event.queryStringParameters.email
      );
      break;





// ....






    default:
      response = util.buildResponse(404, '404 Not Found');
  }

  

  return response;


};
