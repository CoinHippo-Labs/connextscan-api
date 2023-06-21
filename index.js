exports.handler = async (event, context, callback) => {
  const { getParams, errorOutput } = require('./utils/io');

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

  switch (req.url) {
    case '/':
      const { method } = { ...params };
      switch (method) {
        case 'getTokensPrice':
          try {
            output = await require(`./services/${method}`)(params);
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

  return output;
};