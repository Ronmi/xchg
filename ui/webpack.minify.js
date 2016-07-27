var webpack = require("webpack");
var conf = require("./webpack.config.js");

conf.plugins.push(new webpack.optimize.UglifyJsPlugin({
  compress: true,
  sourceMap: false,
}));

module.exports = conf;
