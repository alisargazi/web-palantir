var express = require('express');
var router = express.Router();
var models = require('../models/models');
var logger = require('log4js').getLogger("sign");
var sign = require("../controllers/sign");

/* 登入系统 */
router.post('/login', sign.login);

/* 登出系统 */
router.get('/signout', sign.signout);

module.exports = router;
