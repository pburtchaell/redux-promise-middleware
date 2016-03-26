'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _webpack3 = require('../webpack.config');

var _webpack4 = _interopRequireDefault(_webpack3);

var _index = require('./handlers/index');

var indexHandlers = _interopRequireWildcard(_index);

var _api = require('./handlers/api');

var apiHandlers = _interopRequireWildcard(_api);

var _post = require('./handlers/post');

var postHandlers = _interopRequireWildcard(_post);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var port = process.env.PORT || 8000;
var address = 'localhost';

var app = (0, _express2.default)();
var compiler = (0, _webpack2.default)(_webpack4.default);

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: _webpack4.default.output.publicPath
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