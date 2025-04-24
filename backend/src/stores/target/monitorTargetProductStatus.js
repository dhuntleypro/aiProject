const https = require('https');
const util = require('../../../utils/util');

module.exports.monitorTargetProductStatus = async (body) => {
  try {
    const tcin = extractTcinFromUrl(body.productUrl);

    if (!tcin) {
      return util.buildResponse(400, {
        success: false,
        message: 'Missing or invalid Target product URL (TCIN not found)',
      });
    }

    const url = `https://redsky.target.com/redsky_aggregations/v1/web/pdp_client_v1?key=eb2551e4aa4cdb0a501a9f3b7b6f90a3&tcin=${tcin}&pricing_store_id=3991&channel=WEB`;

    const productData = await getJSONFromUrl(url);
    const inStock = productData?.data?.product?.availability_status === 'IN_STOCK';

    return util.buildResponse(200, {
      tcin,
      inStock,
      title: productData?.data?.product?.item?.product_description?.title || '',
      price: productData?.data?.product?.price?.formatted_current_price || '',
    });

  } catch (error) {
    console.error('Error fetching Target product:', error.message);
    return util.buildResponse(500, {
      success: false,
      message: 'Failed to process the Target request',
      error: error.message,
    });
  }
};

function getJSONFromUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (err) {
          reject(new Error('Invalid JSON response from Target API'));
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

function extractTcinFromUrl(url) {
  const match = url.match(/\/A-(\d{8})/);
  return match ? match[1] : null;
}
