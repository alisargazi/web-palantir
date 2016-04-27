
var express = require('express');
var router = express.Router();
var models = require('../models/models');
var logger = require('log4js').getLogger("apilog");
var uuid = require('node-uuid'); 
var moment = require('moment'); 
var config = require('../config/config'); 

/**
 * 记录api调用记录
 */
module.exports.requestLog = function(req, res, next) {
  if(!req._startTime){
    req._startTime = Date.now();
  }
  var urls = req.url.split("/");
  var url = config.PALANTIR_URL + urls[2] + "/" + urls[3];
  var params = req.body || {};
  
  var apiLog = {
    "id": uuid.v4(),
    "api_url": url,
    "client_ip": getClientIp(req),
    "access_time": moment().format("YYYY-MM-DD HH:mm:ss"),
    "api_params" : JSON.stringify(params),
    "key_value": 'palantir-web'
  }
  
  req.__requestLogId = apiLog.id;
  
  //无论日志是否记录成功，都进行接口访问
  models.ApiAccessLog.create(apiLog).then(function(){});
  next();
  
};

/**
 * 记录日志完成状态
 */
module.exports.completeLog = function(req, resCode){
  var apiLog = {
    id: req.__requestLogId,
    res_code : resCode,
    cost_time : Date.now() - req._startTime
  }
  
  models.ApiAccessLog.upsert(apiLog, {
    where: {
      id : req.__requestLogId
    }
  }).then(function(){});  
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
