const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/mgmt",
    createProxyMiddleware({
      target: "http://192.168.100.178:17665",
      changeOrigin: true,
    })
  );
};