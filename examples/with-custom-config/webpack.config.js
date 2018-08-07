const path = require('path');
const webpack = require('webpack');
const HtmlwebpackPlugin = require('html-webpack-plugin');

// webpack config
module.exports = {
  mode: 'development',
  entry: './index.js',
  output: {
    path: __dirname,
    filename: 'dist.js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlwebpackPlugin({ template: path.resolve(__dirname, 'index.html') })
  ],
  devServer: {
    port: 3000,
    hot: true,
    open: true
  }
};
