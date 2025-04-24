const AWS = require('aws-sdk');

AWS.config.update({
  region: process.env.REGION_NAME,
});
const util = require('./util');
const item = process.env.STRIPE_PUBLISHABLE_KEY;

// not using....
async function config() {
  // const output = { publishableKey: item };

  // return util.buildResponse(200, output);
}

module.exports.config = config;