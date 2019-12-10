// ncapsulates a config for Webpack used to generate UMD builds

const config = {
  mode: 'production',
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
  }
};


// If the environment is set to production, compress the output file
if (process.env.NODE_ENV !== 'production') {
  config.optimization = {
    minimize: false
  };
}

module.exports = config;
