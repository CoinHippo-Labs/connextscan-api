exports.handler = async (
  event,
  context,
  callback,
) => {
  const {
    getParams,
  } = require('./utils');

  // parse function event to req
  const req = {
    body: { ...(event.body && JSON.parse(event.body)) },
    query: { ...event.queryStringParameters },
    params: { ...event.pathParameters },
    method: event.requestContext?.http?.method,
    url: (event.routeKey || '').replace('ANY ', ''),
    headers: event.headers,
  };

  const params = getParams(req);

  let response;

  switch (req.url) {
    case '/':
      const {
        method,
      } = { ...params };

      switch (method) {
        case 'getTokensPrice':
          try {
            response = await require(`./services/${method}`)(params);
          } catch (error) {
            response = {
              error: true,
              code: 400,
              message: error?.message,
            };
          }
          break;
        default:
          break;
      }
      break;
   default:
      break;
  }

  return response;
};