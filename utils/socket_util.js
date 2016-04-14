var config = require("../config/config");
var logger = require('log4js').getLogger("socket_util");
var io = require('socket.io')();

io.on('connection', function (_socket) {
  logger.debug("socket.io conetcion");
});

exports.listen = function (_server) {
  return io.listen(_server);
};

exports.io = io;