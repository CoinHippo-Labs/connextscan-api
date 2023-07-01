exports.handler = async (event, context, callback) => {
  const moment = require('moment');

  const { getTokensPrice } = require('./methods');
  const { getParams, errorOutput, finalizeOutput } = require('./utils/io');

  // parse function event to req
  const req = {
    url: (event.routeKey || '').replace('ANY ', ''),
    method: event.requestContext?.http?.method,
    headers: event.headers,
    params: { ...event.pathParameters },
    query: { ...event.queryStringParameters },
    body: { ...(event.body && JSON.parse(event.body)) },
  };

  let output;
  // create params from req
  const params = getParams(req);
  const { method } = { ...params };
  // for calculate time spent
  const start_time = moment();

  switch (req.url) {
    case '/':
      delete params.method;
      switch (method) {
        case 'getTokensPrice':
          try {
            output = await getTokensPrice(params);
          } catch (error) {
            output = errorOutput(error);
          }
          break;
        default:
          break;
      }
      break;
    default:
      break;
  }

  output = finalizeOutput(output, { ...params, method }, start_time);
  return output;
};