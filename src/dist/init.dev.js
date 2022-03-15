"use strict";

require("regenerator-runtime");

require("dotenv/config");

require("./db");

require("./models/Video");

var _server = _interopRequireDefault(require("./server"));

require("./models/User");

require("./models/Comment");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var PORT = process.env.PORT || 25185;

var handleListening = function handleListening() {
  return console.log("Server listening on port http://localhost:".concat(PORT));
};

_server["default"].listen(PORT, handleListening);