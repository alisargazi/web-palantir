
var express = require('express');
var router = express.Router();
var models = require('../models/models');
var logger = require('log4js').getLogger("user");
var uuid = require('node-uuid'); 
var moment = require('moment'); 
var config = require('../config/config'); 

/**
 * 查询所有满足条件用户
 */
module.exports.findAll = function(req, res, next) {
  
  var pageNumber = parseInt(req.query.pageNumber || 1);
  var pageSize = parseInt(req.query.pageSize || 5);
  
  models.User.findAndCountAll({
    offset: (pageNumber - 1) * pageSize, 
    limit: pageSize,
    order: 'create_time'
  }).then(function(result){
    
    var rowCount = result.count;
    var pageCount = 1;
    
    if(rowCount > pageSize){
     pageCount = result.count % pageSize == 0 ? result.count / pageSize : Math.ceil(result.count / pageSize);
    }
    
    res.render("user/list.html", {
      users: result.rows,
      page:{
        pageNumber: pageNumber,
        pageSize: pageSize,
        rowCount: rowCount,
        pageCount: pageCount
      }
    });
  });

};

/**
 * 通过Id查询用户信息，返回页面
 */
module.exports.findByIdToView = function(req, res, next) {
  var userId = req.query.userId;
  models.User.findOne({
    where: {
      id : userId
    }
  }).then(function(user){
    res.render("user/user.html", {
      user: user
    });
  });
};

/**
 * 跳转到修改页
 */
module.exports.toUpdate = function(req, res, next) {
  var userId = req.query.userId;
  models.User.findOne({
    where: {
      id : userId
    }
  }).then(function(user){
    res.render("user/update.html", {
      user: user
    });
  });
};

/**
 * 修改用户信息
 */
module.exports.update = function(req, res, next) {
  var user = req.body;
  user.last_modify_time = moment().format(config.DATE_FORMAT);

  models.User.upsert(user, {
    where: {
      id : user.id
    }
  }).then(function(){
    res.redirect("/user/list");
  });
};

/**
 * 根据id删除用户
 */
module.exports.delete = function(req, res, next) {
  var id = req.body.id;
  models.User.destroy({
    where: {
      id : id
    }
  }).then(function(){
    res.send(true);
  });
};

/**
 * 新增用户
 */
module.exports.save = function(req, res, next) {
  var user = req.body;
  user.expiration_time += " 00:00:00";
  models.User.create(user).then(function(){
    res.redirect("/user/list");
  });
};


/**
 * 验证用户名是否存在
 * 
 */
module.exports.checkLoginName = function(req, res, next) {
  var login_name = req.body.login_name;
  models.User.findOne({
    where: {
      login_name : login_name
    }
  }).then(function(user){
    var result = true;
    
    if(user){
      result = false;
    }
    res.send(result);
  });
  
};

/**
 * 查看用户详细信息
 */
module.exports.show = function(req, res, next) {
  var userId = req.query.userId
  models.User.findOne({
    where: {
      id : userId
    }
  }).then(function(user){
    res.render("user/show.html", {
      user: user
    });
  });
};

/**
 * 查看当前用户信息
 */
module.exports.showUserInfo = function(req, res, next) {
  var userId = req.session.currentUser.id;
  models.User.findOne({
    where: {
      id : userId
    }
  }).then(function(user){
    res.render("profile/profile.html", {
      user: user
    });
  });
  
};

/**
 * 查看当前用户信息
 */
module.exports.saveUserInfo = function(req, res, next) {
  var user = req.body;
  models.User.upsert(user, {
    where: {
      id : user.id
    }
  }).then(function(){
    res.redirect("/user/showUserInfo");
  });
  
};

/**
 * 查看当前用户信息 JSON
 */
module.exports.showUserInfoJson = function(req, res, next) {
  var userId = req.session.currentUser.id;
  models.User.findOne({
    where: {
      id : userId
    }
  }).then(function(user){
    res.json(user);
  });
  
};