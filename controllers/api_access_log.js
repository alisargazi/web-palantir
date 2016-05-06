
var express = require('express');
var router = express.Router();
var mongoModels = require('../models/mogon_models');
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
    "access_time": moment().format(config.DATE_FORMAT),
    "api_params" : params,
    "key_value": 'palantir-web',
    "user_id": req.session.currentUser.id
  }
   
  req.__requestLogId = apiLog.id;
  
  //无论日志是否记录成功，都进行接口访问
  //models.ApiAccessLog.create(apiLog).then(function(){});
  
  //在mongo中进行记录
  mongoModels.AccessLog.create(apiLog, function(err, log){
    if(err){
      console.log(err);
    }   
    req.__log = log;
  })
  
  next();
  
};

/**
 * 记录日志完成状态
 */
module.exports.completeLog = function(req, resCode){  
  if(req.__log){
    mongoModels.AccessLog.findByIdAndUpdate(req.__log._id, { $set: { res_code: resCode, cost_time : Date.now() - req._startTime }}, function (err, log) {
      if (err){
        console.log(err);
      } 
    });      
  }
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
