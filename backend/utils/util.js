function buildResponse(statusCode, body) {
  return {
    statusCode: statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  };
}

module.exports.buildResponse = buildResponse;


// function buildResponse(statusCode, body) {
//   const isJson = typeof body === 'object' && body !== null;  // Ensure the body is an object, not null
//   const responseBody = isJson ? body : { message: body };    // If body is a string, wrap it in an object

//   return {
//     statusCode: statusCode,
//     headers: {
//       'Access-Control-Allow-Origin': '*',
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(responseBody),
//   };
// }

// module.exports.buildResponse = buildResponse;
