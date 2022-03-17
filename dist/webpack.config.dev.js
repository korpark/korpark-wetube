"use strict";

var MiniCssExtractPlugin = require("mini-css-extract-plugin");

var path = require("path");

var BASE_JS = "./src/client/js/";
module.exports = {
  entry: {
    main: BASE_JS + "main.js",
    videoPlayer: BASE_JS + "videoPlayer.js",
    recorder: BASE_JS + "recorder.js",
    commentSections: BASE_JS + "commentSections.js"
  },
  plugins: [new MiniCssExtractPlugin({
    filename: "css/styles.css"
  })],
  output: {
    filename: "js/[name].js",
    path: path.resolve(__dirname, "assets")
  },
  module: {
    rules: [{
      test: /\.js$/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [["@babel/preset-env", {
            targets: "defaults"
          }]]
        }
      }
    }, {
      test: /\.scss$/,
      use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
    }]
  }
};