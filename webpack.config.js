/**
 * webpack.config.js
 * Description: This file encapsulates a config for Webpack used
 * to generate UMD builds.
 */
const webpack = require('webpack');

const config = {
  entry: './src/index',

  // Compile JS files with Babel
  module: {
    rules: [
      { test: /\.js$/, use: { loader: 'babel-loader' }, exclude: /node_modules/ }
    ]
  },

  output: {
    library: 'ReduxPromiseMiddleware',
    libraryTarget: 'umd'
  },

  plugins: []
};

// If the environment is set to production, compress the output file
if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    })
  );
}

module.exports = config;
