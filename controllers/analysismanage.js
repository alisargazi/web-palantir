
var express = require('express');
var router = express.Router();
var models = require('../models/models');
var logger = require('log4js').getLogger("proxy");
var config = require("../config/config");
var redisUtil = require('../utils/redis_util');
var request = require('superagent');

/* 执行get请求系统 */
module.exports.get = function(req, res, next) {
    request.get(config.PALANTIR_URL).query(req.query).end(function(err, resp){
        res.json(JSON.parse(resp.text));       
      });
};

/* 执行post请求 */
module.exports.post = function(req, res, next) {
  var urls = req.url.split("/");
  var url = config.PALANTIR_URL + urls[2] + "/" + urls[3];
  //logger.debug(url);
  console.log(url);
  var params = req.body.params || req.body.data;
  console.log(params);
  request.post(url).set().set('Content-Type', 'application/json').send(params).end(function(err, resp){
    
    if(err){
      console.log(err);
      res.json({});
      return ;
    }
    
    res.json(JSON.parse(resp.text));
  });
  
};
