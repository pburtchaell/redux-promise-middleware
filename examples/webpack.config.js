/**
 * webpack.config.js
 * Description: This file encapsules a config for Webpack for the examples.
 * The config always compiles a development file for each example directory.
 */
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

module.exports = {
  devtool: 'eval',

  // Compile one file for each example directory
  entry: fs.readdirSync(__dirname).reduce((entries, dir) => {
    if (fs.statSync(path.join(__dirname, dir)).isDirectory()) {
      entries[dir] = path.join(__dirname, dir, 'index.js');
    }

    return entries;
  }, {}),

  output: {
    path: path.join(__dirname, '/'),
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    publicPath: '/'
  },

  // Compile files in a development environment and hide compiler errors
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ],

  // Compile JS files with Babel
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },

  // Create an alias for the local middleware source file
  resolve: {
    alias: {
      'redux-promise-middleware': path.join(__dirname, '..', 'src')
    }
  }
};
