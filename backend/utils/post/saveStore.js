const AWS = require('aws-sdk');
const util = require('../util');
const models = require('../../service/models/store') 
AWS.config.update({
  region: 'us-east-1',
});



const dynamodb = new AWS.DynamoDB.DocumentClient();



// Function to save a user
async function saveStore() {
  const tableName = 'prof-website-store-table';

  const params = {
    TableName: tableName,
    Item: models.storeDataModel,
  };

  try {
    await dynamodb.put(params).promise();
    return true;
    // return util.buildResponse(500, "creating store");

  } catch (error) {
    // console.error('There is an error saving user: ', error);
    // return false;
    
    return util.buildResponse(500, ` Error creating store: ${error}`);
 
  }
}



module.exports.saveStore = saveStore;














// function createStore(newUserData ){
//       const newStore = storeDataModel
      
      
//       //
//       newStore.id = newUserData.store_owner_id
//       newStore.owner_id = newUserData.id
//       newStore.store_users = [newUserData.id]
//       newStore.store_founder = newUserData.name
//       newStore.email = newUserData.email
   
   
//       // Define the DynamoDB table name
//       const tableName = 'prof-website-store-table';
      
//       // Create the DynamoDB put parameters
//       const params = {
//         TableName: tableName,
//         Item: newStore,
//       };
      
//       // Put the item into the DynamoDB table
//       dynamodb.put(params, (err, data) => {
//         if (err) {
//             return util.buildResponse(500, `Error creating DynamoDB row: ${err}`); // added to store

//         } else {
//           console.log('DynamoDB row created successfully:', data);
//         }
//       });
     
      
// }

  // Define the store data
   



// module.exports.createStore = createStore;
