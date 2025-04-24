const { decode } = require('html-entities');
const util = require('../../../utils/util');

exports.getTargetProductDetails = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ message: 'Method Not Allowed' }),
      };
    }

    const body = JSON.parse(event.body || '{}');
    const { productUrl } = body;

    if (!productUrl) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing product url' }),
      };
    }

    // const tcin = productUrl?.match(/\/A-(\d{8})/)?.[1];

    // supports up to 12 digit tcin
    const tcin = productUrl?.match(/\/A-(\d{8,12})/)?.[1];

    if (!tcin) {
      return util.buildResponse(400, { message: 'Invalid Target URL' });
    }

    const redskyUrl = `https://redsky.target.com/redsky_aggregations/v1/web/pdp_client_v1?key=eb2551e4aa4cdb0a501a9f3b7b6f90a3&tcin=${tcin}&pricing_store_id=3991&channel=WEB`;
    const response = await fetch(redskyUrl);

    if (!response.ok) {
      return util.buildResponse(response.status, {
        message: `Target API returned status ${response.status}`,
      });
    }

    const json = await response.json();
    const product = json?.data?.product;
    if (!product) {
      return util.buildResponse(404, { message: 'Product not found' });
    }

    const item = product?.item || {};
    const category = product?.category || {};
    const imageInfo = item?.enrichment?.image_info || {};

    const result = {
      tcin,
      title: decode(product?.item?.product_description?.title || ''),
      brand: item?.primary_brand?.name || '',
      vendor: item?.product_vendors?.[0]?.vendor_name || '',
      buyUrl: item?.enrichment?.buy_url || '',
      category: category?.name || '',
      lastCategory:
        decode(category?.breadcrumbs?.slice(-1)?.[0]?.name || 'Uncategorized'),
      description: {
        html: decode(item?.product_description?.downstream_description || ''),
        bullets: (item?.product_description?.bullet_descriptions || []).map(decode),
        highlights: (item?.product_description?.soft_bullets?.bullets || []).map(decode),
      },
      images: {
        primary: imageInfo?.primary_image?.url || '',
        swatch: imageInfo?.swatch_image?.url || '',
        alternate: (imageInfo?.alternate_images || []).map(i => i.url),
        content: (imageInfo?.content_labels || []).map(i => i.image_url),
      },
      dimensions: {
        height: item?.package_dimensions?.height,
        width: item?.package_dimensions?.width,
        depth: item?.package_dimensions?.depth,
        weight: item?.package_dimensions?.weight,
        units: {
          dimension: item?.package_dimensions?.dimension_unit_of_measure,
          weight: item?.package_dimensions?.weight_unit_of_measure,
        },
      },
      features: {
        seatDimensions: decode(item?.product_description?.bullet_descriptions?.find(x => x.includes('Seat Dimensions')) || ''),
        seatBackHeight: decode(item?.product_description?.bullet_descriptions?.find(x => x.includes('Seat back height')) || ''),
        adjustability: decode(item?.product_description?.bullet_descriptions?.find(x => x.includes('Adjustable Height')) || ''),
        upholstery: decode(item?.product_description?.bullet_descriptions?.find(x => x.includes('Upholstered')) || ''),
      },
      price: {
        // min: price?.current_retail_min,
        current: product?.price?.current_retail || product?.price?.current_retail_min ,
        regular: product?.price?.formatted_comparison_price || '',
        type: product?.price?.formatted_current_price_type || '',
        saveDollar: product?.price?.save_dollar || 0,
        savePercent: product?.price?.save_percent || 0,
      },
      fulfillment: {
        isMarketplace: item?.fulfillment?.is_marketplace || false,
        purchaseLimit: item?.fulfillment?.purchase_limit || 0,
        shippingExclusions: item?.fulfillment?.shipping_exclusion_codes || [],
      },
      returnPolicy: {
        method: item?.return_method || '',
        message: item?.return_policies_guest_message || '',
        formatted: item?.formatted_return_method || '',
        policies: item?.return_policies || [],
      },
      extras: {
        barcode: item?.primary_barcode,
        cartAddOnThreshold: item?.cart_add_on_threshold || 0,
        warranty: decode(item?.product_description?.bullet_descriptions?.find(x => x.includes('Warranty')) || ''),
        care: decode(item?.product_description?.bullet_descriptions?.find(x => x.includes('Care & Cleaning')) || ''),
      },
    };

    //  return util.buildResponse(200, result);
   return util.buildResponse(200, {json});
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Internal Server Error',
        error: error.message,
        stack: error.stack,
      }),
    };
  }
};





// const { decode } = require('html-entities');
// const util = require('../../../utils/util');

// exports.getTargetProductDetails = async (event) => {
//   try {
//     if (event.httpMethod !== 'POST') {
//       return {
//         statusCode: 405,
//         body: JSON.stringify({ message: 'Method Not Allowed' }),
//       };
//     }

//     const body = JSON.parse(event.body || '{}');
//     const { productUrl } = body;

//     if (!productUrl) {
//       return {
//         statusCode: 400,
//         body: JSON.stringify({ message: 'Missing product url' }),
//       };
//     }

//     const tcin = productUrl?.match(/\/A-(\d{8})/)?.[1];
//     if (!tcin) {
//       return util.buildResponse(400, { message: 'Invalid Target URL' });
//     }

//     const redskyUrl = `https://redsky.target.com/redsky_aggregations/v1/web/pdp_client_v1?key=eb2551e4aa4cdb0a501a9f3b7b6f90a3&tcin=${tcin}&pricing_store_id=3991&channel=WEB`;
//     const response = await fetch(redskyUrl);

//     if (!response.ok) {
//       return util.buildResponse(response.status, {
//         message: `Target API returned status ${response.status}`,
//       });
//     }

//     const json = await response.json();
//     const product = json?.data?.product;
//     if (!product) {
//       return util.buildResponse(404, { message: 'Product not found' });
//     }

//     const item = product?.item || {};
//     const categoryName = product?.category?.name || '';
//     const breadcrumbs = product?.category?.breadcrumbs || [];

//     const enrichmentData = item?.enrichment || {};
//     const imageInfo = enrichmentData?.image_info || {};

//     const enrichment = {
//       buyUrl: enrichmentData?.buy_url || '',
//       primaryImage: imageInfo?.primary_image?.url || '',
//       swatchImage: imageInfo?.swatch_image?.url || '',
//       alternateImages: (imageInfo?.alternate_images || []).map(img => img.url || ''),
//       contentLabels: (imageInfo?.content_labels || []).map(c => c.image_url || ''),
//       sizeChartUrl: enrichmentData?.size_chart_fragment_url || '',
//       returnPolicies: item?.return_policies || [],
//     };

//     const variationHierarchy = (product?.variation_hierarchy || []).map((v) => ({
//       name: v.name,
//       value: v.value,
//       tcin: v.tcin,
//       buyUrl: v.buy_url,
//       swatchImage: v.swatch_image_url,
//       image: v.primary_image_url,
//       isSoldOut: v.availability?.is_sold_out ?? false,
//     }));

//     const classification = item?.product_classification || {};
//     const productType = {
//       name: classification?.product_type_name || '',
//       behavior: classification?.purchase_behavior || '',
//       itemType: classification?.item_type?.name || '',
//       itemTypeId: classification?.item_type?.type || '',
//     };

//     const description = item?.product_description || {};
//     const productDescription = {
//       title: decode(description?.title || ''),
//       full: decode(description?.downstream_description || ''),
//       bullets: (description?.bullet_descriptions || []).map(decode),
//       highlights: (description?.soft_bullets?.bullets || []).map(decode),
//       highlightHTML: decode(description?.soft_bullet_description || ''),
//     };

//     const brand = item?.primary_brand?.name || '';
//     const vendor = item?.product_vendors?.[0]?.vendor_name || '';
//     const dimensions = {
//       height: item?.package_dimensions?.height,
//       width: item?.package_dimensions?.width,
//       depth: item?.package_dimensions?.depth,
//       weight: item?.package_dimensions?.weight,
//       units: {
//         dimension: item?.package_dimensions?.dimension_unit_of_measure,
//         weight: item?.package_dimensions?.weight_unit_of_measure,
//       },
//     };

//     const handling = {
//       origin: item?.handling?.import_designation_description || '',
//       isCarbonNeutral: item?.compliance?.is_carbon_neutral ?? false,
//       isProp65: item?.compliance?.is_proposition_65 ?? false,
//     };

//     const fulfillment = item?.fulfillment || {};
//     const returnMessage = item?.return_policies_guest_message || '';
//     const returnMethod = item?.return_method || '';
//     const formattedReturnMethod = item?.formatted_return_method || '';
//     const cartAddOnThreshold = item?.cart_add_on_threshold || 0;
//     const relationshipType = item?.relationship_type_code || '';

//     const price = product?.price || {};
//     const priceDetails = {
//       current: price?.formatted_current_price,
//       regular: price?.formatted_comparison_price,
//       type: price?.formatted_current_price_type,
//       min: price?.current_retail_min,
//       max: price?.reg_retail_max,
//     };

//     const ratingsStats = product?.ratings_and_reviews?.statistics || {};
//     const recommendedCount = ratingsStats?.recommended_count || 0;

//     const lastCategory = breadcrumbs.length
//       ? decode(breadcrumbs[breadcrumbs.length - 1]?.name || 'unknown')
//       : 'no category found';

//     const result = {
//       tcin,
//       brand,
//       vendor,
//       category: categoryName,
//       lastCategory,
//       relationshipType,
//       classification,
//       productType,
//       productDescription,
//       enrichment,
//       variations: variationHierarchy,
//       dimensions,
//       handling,
//       fulfillment,
//       returnPolicies: enrichment.returnPolicies,
//       returnMessage,
//       returnMethod,
//       formattedReturnMethod,
//       cartAddOnThreshold,
//       price: priceDetails,
//       ratings: {
//         recommendedCount,
//         average: ratingsStats?.rating?.average || 0,
//         count: ratingsStats?.rating?.count || 0,
//       },
//     };

//     // return util.buildResponse(200, result);
//     return util.buildResponse(200, {json});

//   } catch (error) {
//     return {
//       statusCode: 500,
//       body: JSON.stringify({
//         message: 'Internal Server Error',
//         error: error.message,
//         stack: error.stack,
//       }),
//     };
//   }
// };







// const { decode } = require('html-entities');
// const util = require('../../../utils/util');

// exports.getTargetProductDetails = async (event) => {
//   try {
//     if (event.httpMethod !== 'POST') {
//       return {
//         statusCode: 405,
//         body: JSON.stringify({ message: 'Method Not Allowed' }),
//       };
//     }

//     const body = JSON.parse(event.body || '{}');
//     const { productUrl } = body;

//     if (!productUrl) {
//       return {
//         statusCode: 400,
//         body: JSON.stringify({ message: 'Missing product url' }),
//       };
//     }

//     const tcin = productUrl?.match(/\/A-(\d{8})/)?.[1];
//     if (!tcin) {
//       return util.buildResponse(400, { message: 'Invalid Target URL' });
//     }

//     const redskyUrl = `https://redsky.target.com/redsky_aggregations/v1/web/pdp_client_v1?key=eb2551e4aa4cdb0a501a9f3b7b6f90a3&tcin=${tcin}&pricing_store_id=3991&channel=WEB`;
//     const response = await fetch(redskyUrl);

//     if (!response.ok) {
//       return util.buildResponse(response.status, {
//         message: `Target API returned status ${response.status}`,
//       });
//     }

//     const json = await response.json();
//     const product = json?.data?.product;

//     if (!product) {
//       return util.buildResponse(404, { message: 'Product not found' });
//     }

//     const categoryV = product?.category?.name || "";
//     const breadcrumbs = product?.category?.breadcrumbs || [];
//     const recommended_count = product?.category.ratings_and_reviews.statistics.recommended_count || 0;

//     const category = breadcrumbs.length > 0
//       ? decode(breadcrumbs[breadcrumbs.length - 1]?.name || 'unknown')
//       : 'no category found';


//       const targetData = { 
//         tcin,
//         categoryV, 
//         category,
//         recommended_count,
//         // recommended_percentage
      
//       }

//       return util.buildResponse(200, targetData);
//       // return util.buildResponse(200, json);

//     // return util.buildResponse(200, { category });

//   } catch (error) {
//     return {
//       statusCode: 500,
//       body: JSON.stringify({
//         message: 'Internal Server Error',
//         error: error.message,
//         stack: error.stack,
//       }),
//     };
//   }
// };




// const { decode } = require('html-entities');
// const util = require('../../../utils/util');

// exports.getTargetProductDetails = async (event) => {
//   try {
//     if (event.httpMethod !== 'POST') {
//       return {
//         statusCode: 405,
//         body: JSON.stringify({ message: 'Method Not Allowed' }),
//       };
//     }

//     const body = JSON.parse(event.body || '{}');
//     const { productUrl} = body;

//     const tcin = productUrl?.match(/\/A-(\d{8})/)?.[1];
//    // const tcin = productUrl?.match(/\/A-(\d+)/)?.[1];



//     if (!tcin) {
//       return util.buildResponse(400, { message: 'Invalid Target URL' });
//     }




//     if (!productUrl) {
//       return {
//         statusCode: 400,
//         body: JSON.stringify({ message: 'Missing product url' }),
//       };
//     }

     
//     const redskyUrl = `https://redsky.target.com/redsky_aggregations/v1/web/pdp_client_v1?key=eb2551e4aa4cdb0a501a9f3b7b6f90a3&tcin=${tcin}&pricing_store_id=3991&channel=WEB`;
//     const response = await fetch(redskyUrl);

//     if (!response.ok) {
//       return util.buildResponse(response.status, {
//         message: `Target API returned status ${response.status}`,
//       });
//     }

//     const json = await response.json();
//     const product = json?.data?.product;

//     if (!product) {
//       return util.buildResponse(404, { message: 'Product not found' });
//     }
    



//     // return util.buildResponse(200, {json.data.product} );



//     const {
//       tcin: id,
//       dpci,
//       product_description,
//       price,
//       ratings_and_reviews,
//       item = {},
//       primary_brand,
//       product_classification,
//       enrichment,
//       fulfillment,
//       package_dimensions,
//       finds_posts,
//       category,
//       mmbv_content,
//       predictive_search,
//       relationship_type_code,
//       handling,
//       compliance,
//       environmental_segmentation,
//       promotions,
//       sales_classification_nodes,
//     } = product;

    
//     // const category = product?.category.name ?? ""

//     return util.buildResponse(200, {json} );

//     const classification = item?.product_classification || product_classification || {};
//     const desc = product_description || item?.product_description || {};
//     const brand = primary_brand?.name || item?.primary_brand?.name || '';
//     const enrich = item?.enrichment || enrichment || {};
//     const images = enrich?.images || {};

//     const mapped = {
//       id,
//       dpci,
//       title: decode(desc?.title || enrich?.images?.primary_image?.image_name || 'No Title'),
//       brand: decode(brand),
//       productType: {
//         name: decode(classification?.product_type_name || ''),
//         typeId: classification?.product_type,
//         behavior: classification?.purchase_behavior,
//         itemType: classification?.item_type?.name,
//         itemTypeId: classification?.item_type?.type,
//       },
//       buyUrl: enrich?.buy_url,
//       barcode: item?.primary_barcode,
//       releaseDate: mmbv_content?.street_date,
//       returnPolicy: {
//         raw: item?.return_method ?? '',
//         detailed: Array.isArray(item?.return_policies)
//           ? item.return_policies.map((p) => ({
//               user_type: p.user_type || '',
//               day_count: p.day_count || 0,
//             }))
//           : [],
//       },
//       price: {
//         current: price?.current_retail,
//         regular: price?.reg_retail,
//         formatted: price?.formatted_current_price,
//         cartAddOnThreshold: product?.cart_add_on_threshold,
//         isLimitedTime: product?.is_limited_time_offer,
//       },
//       shipping: {
//         restrictedLocations: fulfillment?.shipping_exclusion_codes || [],
//         poBoxProhibited: fulfillment?.po_box_prohibited_message,
//         giftWrapEligible: fulfillment?.is_gift_wrap_eligible,
//         purchaseLimit: fulfillment?.purchase_limit,
//         hazardous: environmental_segmentation?.is_hazardous_material || false,
//       },
//       handling: {
//         origin: handling?.import_designation_description,
//         compliance: {
//           prop65: compliance?.is_proposition_65 ?? false,
//           carbonNeutral: compliance?.is_carbon_neutral ?? false,
//         },
//       },
//       dimensions: {
//         height: package_dimensions?.height,
//         width: package_dimensions?.width,
//         depth: package_dimensions?.depth,
//         weight: package_dimensions?.weight,
//         unit: {
//           dimensions: package_dimensions?.dimension_unit_of_measure || 'INCH',
//           weight: package_dimensions?.weight_unit_of_measure || 'POUND',
//         },
//       },
//       description: decode(desc?.downstream_description || ''),
//       bulletDescriptions: desc?.bullet_descriptions || [],
//       highlights: (desc?.soft_bullets?.bullets || []).map(decode),
//       formattedHighlights: decode(desc?.soft_bullet_description || ''),
//       image: images?.primary_image_url || '',
//       images: images?.alternate_image_urls || [],
//       swatchImage: images?.swatch_image,
//       relationshipType: relationship_type_code,
//       seo: {
//         searchTerm: decode(predictive_search?.search_term || ''),
//         breadcrumbs: (category?.breadcrumbs || []).map((b) => ({
//           name: decode(b.name),
//           url: b.canonical_url,
//         })),
//         canonicalUrl: category?.canonical_url,
//         parentCategoryId: category?.parent_category_id,
//       },
//       salesClassificationNodeIds: sales_classification_nodes?.node_ids || [],
//       promotions: (promotions || []).map((promo) => ({
//         callout: decode(promo?.callout_text || ''),
//         description: decode(promo?.description || ''),
//         badge: decode(promo?.badge?.text || ''),
//       })),
//       ratings: {
//         average: ratings_and_reviews?.statistics?.rating?.average,
//         count: ratings_and_reviews?.statistics?.rating?.count,
//         distribution: ratings_and_reviews?.statistics?.rating?.distribution,
//         secondary: (ratings_and_reviews?.statistics?.rating?.secondary_averages || []).map((s) => ({
//           ...s,
//           label: decode(s.label),
//         })),
//         recommendedPercentage: ratings_and_reviews?.statistics?.recommended_percentage,
//         notRecommendedCount: ratings_and_reviews?.statistics?.not_recommended_count,
//         questionCount: ratings_and_reviews?.statistics?.question_count,
//         reviews: (ratings_and_reviews?.most_recent || []).map((r) => ({
//           id: r.id,
//           author: decode(r.author?.nickname || ''),
//           title: decode(r.title || ''),
//           text: decode(r.text || ''),
//           rating: r.rating?.value,
//           date: r.rating?.submitted_at,
//         })),
//         photos: ratings_and_reviews?.photos || [],
//       },
//       socialPosts: (finds_posts || []).map((p) => ({
//         id: p.id,
//         image: p.image?.url,
//         caption: decode(p.caption || ''),
//         user: {
//           name: decode(p.user?.display_name || ''),
//           avatar: p.user?.image_url,
//         },
//       })),
//     };

//     return util.buildResponse(200, mapped);

//   } catch (error) {
//     return {
//       statusCode: 500,
//       body: JSON.stringify({
//         message: 'Error creating task',
//         error: error.message,
//         stack: error.stack,
//       }),
//     };
//   }
// };






































// const { decode } = require('html-entities');
// const util = require('../../../utils/util');

// exports.getTargetProductDetails = async (event) => {
//   try {
//     if (event.httpMethod !== 'POST') {
//       return {
//         statusCode: 405,
//         body: JSON.stringify({ message: 'Method Not Allowed' }),
//       };
//     }

//     const body = JSON.parse(event.body || '{}');
//     const { productUrl} = body;

//     const tcin = productUrl?.match(/\/A-(\d{8})/)?.[1];
//    // const tcin = productUrl?.match(/\/A-(\d+)/)?.[1];



//     if (!tcin) {
//       return util.buildResponse(400, { message: 'Invalid Target URL' });
//     }




//     if (!productUrl) {
//       return {
//         statusCode: 400,
//         body: JSON.stringify({ message: 'Missing product url' }),
//       };
//     }

     
//     const redskyUrl = `https://redsky.target.com/redsky_aggregations/v1/web/pdp_client_v1?key=eb2551e4aa4cdb0a501a9f3b7b6f90a3&tcin=${tcin}&pricing_store_id=3991&channel=WEB`;
//     const response = await fetch(redskyUrl);

//     if (!response.ok) {
//       return util.buildResponse(response.status, {
//         message: `Target API returned status ${response.status}`,
//       });
//     }

//     const json = await response.json();
//     const product = json?.data?.product;

//     if (!product) {
//       return util.buildResponse(404, { message: 'Product not found' });
//     }
    


//     return util.buildResponse(200, {json} );

//     // return util.buildResponse(200, {json.data.product} );



//     const {
//       tcin: id,
//       dpci,
//       product_description,
//       price,
//       ratings_and_reviews,
//       item = {},
//       primary_brand,
//       product_classification,
//       enrichment,
//       fulfillment,
//       package_dimensions,
//       finds_posts,
//       category,
//       mmbv_content,
//       predictive_search,
//       relationship_type_code,
//       handling,
//       compliance,
//       environmental_segmentation,
//       promotions,
//       sales_classification_nodes,
//     } = product;

    
//     const classification = item?.product_classification || product_classification || {};
//     const desc = product_description || item?.product_description || {};
//     const brand = primary_brand?.name || item?.primary_brand?.name || '';
//     const enrich = item?.enrichment || enrichment || {};
//     const images = enrich?.images || {};

//     const mapped = {
//       id,
//       dpci,
//       title: decode(desc?.title || enrich?.images?.primary_image?.image_name || 'No Title'),
//       brand: decode(brand),
//       productType: {
//         name: decode(classification?.product_type_name || ''),
//         typeId: classification?.product_type,
//         behavior: classification?.purchase_behavior,
//         itemType: classification?.item_type?.name,
//         itemTypeId: classification?.item_type?.type,
//       },
//       buyUrl: enrich?.buy_url,
//       barcode: item?.primary_barcode,
//       releaseDate: mmbv_content?.street_date,
//       returnPolicy: {
//         raw: item?.return_method ?? '',
//         detailed: Array.isArray(item?.return_policies)
//           ? item.return_policies.map((p) => ({
//               user_type: p.user_type || '',
//               day_count: p.day_count || 0,
//             }))
//           : [],
//       },
//       price: {
//         current: price?.current_retail,
//         regular: price?.reg_retail,
//         formatted: price?.formatted_current_price,
//         cartAddOnThreshold: product?.cart_add_on_threshold,
//         isLimitedTime: product?.is_limited_time_offer,
//       },
//       shipping: {
//         restrictedLocations: fulfillment?.shipping_exclusion_codes || [],
//         poBoxProhibited: fulfillment?.po_box_prohibited_message,
//         giftWrapEligible: fulfillment?.is_gift_wrap_eligible,
//         purchaseLimit: fulfillment?.purchase_limit,
//         hazardous: environmental_segmentation?.is_hazardous_material || false,
//       },
//       handling: {
//         origin: handling?.import_designation_description,
//         compliance: {
//           prop65: compliance?.is_proposition_65 ?? false,
//           carbonNeutral: compliance?.is_carbon_neutral ?? false,
//         },
//       },
//       dimensions: {
//         height: package_dimensions?.height,
//         width: package_dimensions?.width,
//         depth: package_dimensions?.depth,
//         weight: package_dimensions?.weight,
//         unit: {
//           dimensions: package_dimensions?.dimension_unit_of_measure || 'INCH',
//           weight: package_dimensions?.weight_unit_of_measure || 'POUND',
//         },
//       },
//       description: decode(desc?.downstream_description || ''),
//       bulletDescriptions: desc?.bullet_descriptions || [],
//       highlights: (desc?.soft_bullets?.bullets || []).map(decode),
//       formattedHighlights: decode(desc?.soft_bullet_description || ''),
//       image: images?.primary_image_url || '',
//       images: images?.alternate_image_urls || [],
//       swatchImage: images?.swatch_image,
//       relationshipType: relationship_type_code,
//       seo: {
//         searchTerm: decode(predictive_search?.search_term || ''),
//         breadcrumbs: (category?.breadcrumbs || []).map((b) => ({
//           name: decode(b.name),
//           url: b.canonical_url,
//         })),
//         canonicalUrl: category?.canonical_url,
//         parentCategoryId: category?.parent_category_id,
//       },
//       salesClassificationNodeIds: sales_classification_nodes?.node_ids || [],
//       promotions: (promotions || []).map((promo) => ({
//         callout: decode(promo?.callout_text || ''),
//         description: decode(promo?.description || ''),
//         badge: decode(promo?.badge?.text || ''),
//       })),
//       ratings: {
//         average: ratings_and_reviews?.statistics?.rating?.average,
//         count: ratings_and_reviews?.statistics?.rating?.count,
//         distribution: ratings_and_reviews?.statistics?.rating?.distribution,
//         secondary: (ratings_and_reviews?.statistics?.rating?.secondary_averages || []).map((s) => ({
//           ...s,
//           label: decode(s.label),
//         })),
//         recommendedPercentage: ratings_and_reviews?.statistics?.recommended_percentage,
//         notRecommendedCount: ratings_and_reviews?.statistics?.not_recommended_count,
//         questionCount: ratings_and_reviews?.statistics?.question_count,
//         reviews: (ratings_and_reviews?.most_recent || []).map((r) => ({
//           id: r.id,
//           author: decode(r.author?.nickname || ''),
//           title: decode(r.title || ''),
//           text: decode(r.text || ''),
//           rating: r.rating?.value,
//           date: r.rating?.submitted_at,
//         })),
//         photos: ratings_and_reviews?.photos || [],
//       },
//       socialPosts: (finds_posts || []).map((p) => ({
//         id: p.id,
//         image: p.image?.url,
//         caption: decode(p.caption || ''),
//         user: {
//           name: decode(p.user?.display_name || ''),
//           avatar: p.user?.image_url,
//         },
//       })),
//     };

//     return util.buildResponse(200, mapped);

//   } catch (error) {
//     return {
//       statusCode: 500,
//       body: JSON.stringify({
//         message: 'Error creating task',
//         error: error.message,
//         stack: error.stack,
//       }),
//     };
//   }
// };











