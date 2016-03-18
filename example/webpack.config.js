var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'eval',

  entry: {
    app: [
      'webpack-hot-middleware/client',
      path.resolve(__dirname, './client')
    ],
    shared: ['react', 'react-router', 'redux']
  },

  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/'
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.CommonsChunkPlugin('shared', 'shared.js')
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
