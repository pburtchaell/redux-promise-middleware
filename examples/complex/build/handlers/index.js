'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleGet = handleGet;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function handleGet(req, res) {
  res.sendFile(_path2.default.join(__dirname, '..', '..', 'index.html'));
}