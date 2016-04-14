var logger = require('log4js').getLogger("loginAuth");
var config = require("../config/config");

/**
 * 用于过滤需要才能访问的地址
 */
module.exports = function(req, res, next){
  logger.debug("进入用户登录拦截器");
  var path = req.path;
    
  if(path.indexOf("/sign/") == 0 || path.indexOf("/static/") == 0 || path.indexOf("/socket.io/") == 0){
    next();
  }else{
    
    if(path == "/login"){
      next();
      return ;
    }
    
    //增加验证currentApp的验证是为了防止多个应用公用一个redis时同一个浏览器session会在系统中无法辨识
    if(!req.session.currentUser || req.session.currentApp != config.WEB_NAME){
      logger.debug("用户未登录跳转到登录页！");
      //为登录用户跳转到登录页面
      res.redirect("/login");
    }else{
      logger.debug("用户已经登录！");
      //这里应该校验用户的权限属性
      next();
    }    
  }

};