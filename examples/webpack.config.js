var fs = require('fs');
var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'eval',

  entry: fs.readdirSync(__dirname).reduce(function (entries, dir) {
    if (fs.statSync(path.join(__dirname, dir)).isDirectory()) {
      entries[dir] = path.join(__dirname, dir, 'index.js');
    }

    return entries;
  }, {}),

  output: {
    path: __dirname + '/',
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    publicPath: '/'
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.CommonsChunkPlugin('shared.js')
  ],

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel'
      }
    ]
  },

  resolve: {
    alias: {
      'redux-promise-middleware': path.join(__dirname, '..', 'src')
    }
  }
};
