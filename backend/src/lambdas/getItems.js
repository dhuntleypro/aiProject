const AWS = require('aws-sdk');
const util = require('../../utils/util');
const getUserData = require('../../utils/get/getUserData');
const getStoreData = require('../../utils/get/getStoreData');
const getItemsForStore = require('../../utils/get/getItemsForStore');
const getAllItems = require('../../utils/get/getAllItems');
const checkStoreExistence = require('../../utils/check/checkStoreExistence');
const checkUserExistence = require('../../utils/check/checkUserExistence');

AWS.config.update({ region: 'us-east-1' });
const dynamodb = new AWS.DynamoDB.DocumentClient();
const masterEmail = "legit2547@gmail.com";

const ENABLE_EMAIL_VALIDATION = false; // <--- change to false to disable all email validation


// ✅ Cleaner email filter

const filterByEmailIfNeeded = (items, showFilteredItems, email) => {
  const targetEmail = email?.toLowerCase();

  if (showFilteredItems !== "true") return items;

  if (ENABLE_EMAIL_VALIDATION) {
    const isInvalid = !targetEmail || targetEmail.length < 5 || !targetEmail.includes("@");
    if (isInvalid) {
      console.warn("⚠️ Warning: Possibly invalid email passed to filter:", email);
      return items; // ← allow data through, but log warning
    }
  }

  return items.filter(item => item?.email?.toLowerCase() === targetEmail);
};



// ✅ Simplified router for tables that never require ownership check
const PUBLIC_TABLES = new Set([
  "prof-website-product-table",
  "prof-website-collection-table",
  "prof-website-gallery-table",
  "prof-website-benefit-table"
]);

async function getItems(tableName, email, store_id, showFilteredItems) {
  try {
    // 🛑 Basic checks
    if (!email) return util.buildResponse(422, 'Missing Email');
    if (!store_id) return util.buildResponse(422, 'Missing store');
    if (typeof showFilteredItems === 'undefined') return util.buildResponse(422, 'Missing filter');

    const isMaster = email === masterEmail;

    // ✅ Master access to store table
    if (tableName === "prof-website-store-table" && isMaster) {
      const items = await getAllItems(tableName);
      return util.buildResponse(200, items);
    }

    // ✅ Public access tables
    if (PUBLIC_TABLES.has(tableName)) {
      const items = await getItemsForStore.getItemsForStore(tableName, store_id);
      const filtered = filterByEmailIfNeeded(items, showFilteredItems, email);
      return util.buildResponse(200, filtered);
    }

    // 🔐 Auth checks
    const userExists = await checkUserExistence.checkUserExistence(email);
    if (!userExists) return util.buildResponse(422, 'User not found');

    const userData = await getUserData.getUserData(email);
    if (!userData?.Item) return util.buildResponse(401, 'No User Data');

    const storeExists = await checkStoreExistence.checkStoreExistence(store_id);
    if (!storeExists) return util.buildResponse(402, 'Store not found');

    const storeData = await getStoreData.getStoreData(store_id);
    if (!storeData?.Item) {
      console.warn(`[Missing Store Data] store_id=${store_id}, user=${email}`);
      return util.buildResponse(406, 'No Store Data');
    }

    const userId = userData.Item.id;
    const userRole = userData.Item.role;
    const isStoreOwner = storeData.Item.owner_id === userId;
    const isStoreUser = storeData.Item.store_users?.includes(userId);

    // ✅ Special: Handle user table only for store owner
    if (tableName === "prof-website-user-table") {
      if (!isStoreOwner) return util.buildResponse(407, 'Not Store owner');

      const items = isMaster && showFilteredItems === "false"
        ? await getAllItems(tableName)
        : await getUsersForStore(tableName, storeData.Item.store_users);

      const filtered = filterByEmailIfNeeded(items, showFilteredItems, email);
      return util.buildResponse(200, filtered);
    }

    // ✅ Shared access: Customers or members
    if (
      tableName === "prof-website-order-table" ||
      tableName === "prof-website-collection-table"
    ) {
      if (!isStoreUser) return util.buildResponse(402, 'Not member of store');

      const items = isMaster && showFilteredItems === "false"
        ? await getAllItems(tableName)
        : await getItemsForStore.getItemsForStore(tableName, store_id);

      const filtered = filterByEmailIfNeeded(items, showFilteredItems, email);
      return util.buildResponse(200, filtered);
    }

    // ✅ Default fallback: Other endpoints
    if (!isStoreUser) return util.buildResponse(403, 'Not member of store');

    const items = await getItemsForStore.getItemsForStore(tableName, store_id);
    const filtered = filterByEmailIfNeeded(items, showFilteredItems, email);
    return util.buildResponse(200, filtered);

  } catch (error) {
    console.error('Lambda Error:', error);
    return util.buildResponse(502, error);
  }
}

module.exports = getItems;


