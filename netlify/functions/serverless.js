const { getRouter } = require("stremio-addon-sdk");
const addonInterface = require("../../addon");   // adjust path if needed

const router = getRouter(addonInterface);

/*
  Netlify version of your Vercel function.
  Netlify does NOT provide req/res, so we must simulate them.
*/

exports.handler = async (event, context) => {
  return await new Promise((resolve) => {
    // Fake req object
    const req = {
      method: event.httpMethod,
      headers: event.headers,
      url: event.rawUrl || event.path,
      query: event.queryStringParameters,
      body: event.body,
    };

    // Fake res object
    const res = {
      statusCode: 200,
      headers: {},
      setHeader(name, value) {
        res.headers[name] = value;
      },
      end(body) {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: body || "",
        });
      }
    };

    // Call your original Stremio router
    router(req, res, () => {
      res.statusCode = 404;
      res.end("Not found");
    });
  });
};
