'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleGet = handleGet;
function handleGet(req, res) {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
}