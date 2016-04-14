var express = require('express');
var router = express.Router();
var models = require('../models/models');
var logger = require('log4js').getLogger("proxy");
var analysismanage = require("../controllers/analysismanage");

/* 登入系统 */
router.post('/analysismanage/*', analysismanage.post);

/* 登出系统 */
router.get('/analysismanage/*', analysismanage.get);

module.exports = router;
