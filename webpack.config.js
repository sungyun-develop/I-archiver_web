const path = require("path");
const BrowserifyFs = require("browserify-fs");
const webpack = require("webpack");
const url = require("url");

module.exports = {
  // ...
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    fallback: {
      os: require.resolve("os-browserify/browser"),
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
      https: require.resolve("https-browserify"),
      http: require.resolve("http-browserify"),
      url: require.resolve("url/"), // url 모듈의 polyfill
      zlib: require.resolve("browserify-zlib"), // zlib 모듈의 polyfill
      timers: require.resolve("timers-browserify"),
      assert: require.resolve("assert/"),
      buffer: require.resolve("buffer/"),
      process: "process/browser",
      net: require.resolve("net-browserify"),
      dns: false,
      fs: false,
      child_process: false,
    },
  },
};
