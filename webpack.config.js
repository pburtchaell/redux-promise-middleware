var webpack = require('webpack');

var config = {
  entry: './src/index',

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
