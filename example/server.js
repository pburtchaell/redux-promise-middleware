var path = require('path');
var express = require('express');
var webpack = require('webpack');
var config = require('./webpack.local.config');

var port = process.env.PORT || config.devPort;
var address = config.devAddress;

var app = express();
var compiler = webpack(config);

// Logging
app.use(require('morgan')('short'));

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler, {
  log: console.log,
  path: '/__webpack_hmr',
  heartbeat: 10 * 1000
}));

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

/**
 * Mock a fake REST API for creating posts.
 *
app.get('/api/v1/posts', function (req, res) {
  res.json({
    data: [
      {
        type: 'posts',
        id: '1LOL234',
        attributes: {
          title: res.param.title,
          author: res.param.author,
          body: res.param.body
        }
      }
    ]
  });
});*/

/**
 * Mock a fake REST API for getting posts.
 *
app.post('/api/v1/posts/:id', function (req, res) {
  var id = req.param.id;

  res.json({
    data: [
      {
        type: 'posts',
        id: 'post-' + id,
        attributes: {
          title: 'This is teh post title for ' + id,
          author: 'Yo',
          body: 'This is the post text for ' + id
        }
      }
    ]
  });
});*/

app.listen(port, address, function (error) {
  if (error) throw error;

  console.log('server running at http://%s:%d', address, port);
});
