var path = require('path');
var webpack = require('webpack');

var pathToReact = '/node_modules/react/react.js';
var pathToRedux = '/node_modules/redux/lib/index.js';
var pathToReduxReact = '/node_modules/redux/react.js';

// Local development server port and address
var port = 8000;
var address = '0.0.0.0';

/**
 * This is the Webpack configuration file for local development. It contains
 * local-specific configuration such as the React Hot Loader, as well as:
 * - The entry point of the application
 * - Where the output file should be
 * - Which loaders to use on what files to properly transpile the source
 * For more information, see: http://webpack.github.io/docs/configuration.html
 */
module.exports = {

  // Efficiently evaluate modules with source maps
  devtool: 'eval',

  // Configure local server
  devPort: port,
  devAddress: address,

  // Cache the build
  cache: true,

  entry: {
    app: [
      'webpack-hot-middleware/client',
      path.resolve(__dirname, './client')
    ]
  },

  /**
   * Instead of making Webpack go through React and all its dependencies,
   * you can override the behavior in development.
   */
  resolve: {
    extensions: ['', '.js', '.less', '.woff', '.woff2', '.png', '.jpg'],
    modulesDirectories: ['node_modules', 'app']
  },

  /**
   * This will not actually create a bundle.js file in ./dist.
   * It is used by the dev server for dynamic hot loading.
   */
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/'
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(process.env.NODE_ENV)
    })
  ],

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel'
      }
    ],
    noParse: [
      pathToReact,
      pathToRedux,
      pathToReduxReact
    ]
  }
};
