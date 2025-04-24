const util = require('../../../utils/util');


module.exports.searchTargetProducts = async (body) => {
  
  try {
    const keyword  = body.keyword
    const url = `https://redsky.target.com/redsky_aggregations/v1/web/plp_search_v1?key=eb2551e4aa4cdb0a501a9f3b7b6f90a3&keyword=${encodeURIComponent(keyword)}&channel=WEB`;


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







