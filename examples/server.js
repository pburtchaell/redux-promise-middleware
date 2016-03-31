import path from 'path';
import server from 'json-server';
import webpack from 'webpack';
import config from './webpack.config';

const port = process.env.PORT || 8000;
const address = 'localhost';

const app = server.create();
const router = server.router(require('./generate').default());
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

app.get('/complex', (req, res) => {
  res.sendFile(path.join(__dirname, 'complex', 'index.html'));
});

app.get('/simple', (req, res) => {
  res.sendFile(path.join(__dirname, 'simple', 'index.html'))
});

// Mock API
app.use(server.defaults());
app.use('/api', router);

app.listen(port, address, error => {
  if (error) throw error;
  console.log('server running at http://%s:%d', address, port);
});
