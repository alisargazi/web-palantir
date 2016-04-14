
var express = require('express');
var router = express.Router();
var models = require('../models/models');
var logger = require('log4js').getLogger("log");
var uuid = require('node-uuid'); 
var moment = require('moment'); 
var config = require('../config/config'); 

/**
 * 记录日志
 */
module.exports.write = function(req, type) {

  var log = getLog(req, type);
  
  models.SysLoginLog.create(log).then(function(){});
  
};

var getLog = function(req, type){
  
  var log = {
    user_id: req.session.currentUser.id,
    client_ip: getClientIp(req),
    operation_flag: type,
    operation_time: moment().format("YYYY-MM-DD HH:mm:ss")
  };
  
  return log;  
}

/**
 * 获取客户端IP
 */
function getClientIp(req) {
    return req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
}
