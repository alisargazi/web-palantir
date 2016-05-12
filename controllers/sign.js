
var express = require('express');
var router = express.Router();
var models = require('../models/models');
var logger = require('log4js').getLogger("sign");
var config = require("../config/config");
var redisUtil = require('../utils/redis_util');
var EventProxy = require('eventproxy');
var io = require('../utils/socket_util').io;
var loginLog = require('./log');

/* 登入系统 */
module.exports.login = function(req, res, next) {
  
  var loginname = req.body.username;
  var password = req.body.password;

  models.User.findOne({
    where :{
      login_name: loginname,
      password : password     
    }}).then(function(user){
      
      if(!user){
        res.render("login", {
          err: {
            msg: "没有找到用户信息,请确认登录名和密码是否正确!"
          }
        });
      }else{
        
        //账号被冻结，跳转到登录页面
        if(user.account_status == 1){
          res.render("login", {
            err: {
              msg: "该账号已被冻结!"
            }
          });
        }else{//登录成功
          
          req.session.currentUser = user;
          req.session.currentApp = config.WEB_NAME;
          
          try{
            cleanAlreadyOtherUserSession(user.login_name, config.WEB_NAME, req.sessionID, req.sessionStore, function(hasLogin){
              if(hasLogin){
                console.log("当前登录sessionId : " + req.sessionID +  " 在其他浏览器存在登录！");
              }
            });
          }catch(err){
            logger.error("保存session出错");
          }
          
          //跳转到首页
          res.redirect("/index");
          
          //记录登录日志
          loginLog.write(req, "0");

        }

      }
    });

};

/* 登出系统 */
module.exports.signout = function(req, res, next) {
  try{
    if(req.session.currentUser){
      
      //记录登出日志
      loginLog.write(req, "1");
      
      req.session.destroy(function(err){
        if(err){
          logger.error("session 销毁出错！");
          logger.error(err);
        }
      });
    }    
  }catch(err){
    logger.error(err);    
  }

  res.redirect("/login");
};



var cleanAlreadyOtherUserSession = function(loginName, appName, currentSessionId, sessionStore, callback){
  var ep = new EventProxy();

  redisUtil.keys(config.REDIS_PREFIX + "*", function (err, keys) {
    
    if(err){
      throw err;
    }

    //遍历所有sessionid 后执行
    ep.after('hasLogin', keys.length, function (list) {
      //console.log("判断登录后的结果为：");
      //console.log(list);
      for(var i = 0; i < list.length; i++){
        if(list[i] === true){
          callback(true);
          return ;
        }
      }
      
      callback(false);
      return ;
    });
    
    //干掉其他位置的登录用户信息
    ep.on("kill_session", function(sessionId){
      //console.log("干掉 " + sessionId);
      sessionStore.destroy(sessionId, function(error){
        if(error){
          console.log("销毁他处登录的session 出错 " + error);
        }
        
        //console.log("干掉了session  " + sessionId);
        ep.emit("hasLogin", true);
        
        //向浏览器推送存在其他登录的事件
        io.emit("otherLogin", sessionId);
      });
    });
    
    //根据sessionID 获取登录用户信息
    ep.on("get_session", function(redisKey){
      var sessionId = redisKey.substring(5, redisKey.length);
      //检查其他登录时跳过当前sessionID
      if(sessionId === currentSessionId){
        ep.emit("hasLogin", false);
        return ;
      }
      
      //根据sessionID redis中的用户信息
      redisUtil.get(redisKey, function(err, session){
        var session = JSON.parse(session);
        
        //如果存在 session.currentUser 的话，则说明该用户账号在其他地方有登录账号
        if(session.currentUser){
          
          //判断登录有登录账号的登录名与当前登录名以及登录的应用名称是否匹配，如果匹配则干掉对应的sessionId
          //console.log("发现登录名为 " + session.currentUser.login_name + "   登录的应用名称为 " + session.currentApp);
          if(session.currentUser.login_name === loginName && session.currentApp === appName){
            //在其他位置存在登录，则干掉该session
            ep.emit("kill_session", sessionId);
            //ep.emit("hasLogin", true);
            return;
          }
          
          //存在currentUser 但是并不是当前用户
          ep.emit("hasLogin", false);
        }
        
        ep.emit("hasLogin", false);
        
      });
    });
    
    for(var i = 0; i < keys.length; i++){
      var key = keys[i];
      ep.emit("get_session", key);
    }
    
  });
}