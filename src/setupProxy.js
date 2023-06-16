const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = (app) => {
  app.use(
    createProxyMiddleware(["/mgmt"], {
      target: "http://192.168.100.178:17665",
      changeOrigin: true,
    })
  );
  app.use(
    createProxyMiddleware(["/retrieval"], {
      target: "http://192.168.100.178:17668",
      changeOrigin: true,
    })
  );
};
