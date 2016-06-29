var webpack = require('webpack');

var config = {
  entry: './src/index',

  module: {
    loaders: [
      { test: /\.js$/, loaders: ['babel'], exclude: /node_modules/ }
    ]
  },

  output: {
    library: 'ReduxPromiseMiddleware',
    libraryTarget: 'umd'
  },

  plugins: [
    new webpack.optimize.OccurenceOrderPlugin()
  ]
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
