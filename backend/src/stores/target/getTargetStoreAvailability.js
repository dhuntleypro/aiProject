const fs = require('fs');
const util = require('../../../utils/util');


module.exports.getTargetStoreAvailability = async (body) => {
  
  try {
    const tcin = extractTcinFromUrl(body.productUrl);
    const url = `https://redsky.target.com/redsky_aggregations/v1/web/pdp_pickup_only_v1?key=eb2551e4aa4cdb0a501a9f3b7b6f90a3&tcin=${body.tcin}&store_id=${body.store_id}&channel=WEB`;
   
    return util.buildResponse(200, url);

  
  } catch (error) {
    console.error('Error:', error.message);

    // Handle challenge-required error
    if (error.response && error.response.body && error.response.body.message === 'challenge_required') {
      await handleChallenge(ig, error.response.body.challenge.api_path);
    }

    return {
      success: false,
      message: 'Failed to process the target request',
      error: error.message,
    };
  }
};




function extractTcinFromUrl(url) {
    const match = url.match(/\/A-(\d{8})/);
    return match ? match[1] : null;
  }
  
