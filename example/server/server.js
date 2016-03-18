import path from 'path';
import express from 'express';
import webpack from 'webpack';
import config from '../webpack.config';
import * as indexHandlers from './handlers/index';
import * as apiHandlers from './handlers/api';
import * as postHandlers from './handlers/post';

const port = process.env.PORT || 8000;
const address = 'localhost';

const app = express();
const compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler, {
  log: console.log,
  path: '/__webpack_hmr',
  heartbeat: 10 * 1000
}));

app.get('/', indexHandlers.handleGet);
app.get('/api/v1/', apiHandlers.handleGet);
app.get('/api/v1/posts/', postHandlers.handleGet);
app.post('/api/v1/posts/:id', postHandlers.handlePost);

app.listen(port, address, function (error) {
  if (error) throw error;
  console.log('server running at http://%s:%d', address, port);
});
