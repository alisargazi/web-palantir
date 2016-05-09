var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
//var logger = require('morgan');
var log4js = require('log4js');
log4js.configure('log4js.json', { reloadSecs: 300 });
var log = log4js.getLogger("app");
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);

var loginAuth = require('./middleware/login_auth');

var sign = require('./routes/sign');
var config = require("./config/config");
var login = require('./routes/login');
var index = require('./routes/index');
var proxy = require('./routes/proxy');

var app = express();

// 视图引擎设置
var nunjucks = require('nunjucks')
nunjucks.configure('views', {
    autoescape: true,
    express: app
});
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
app.use(log4js.connectLogger(log4js.getLogger("http"), { level: 'auto' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//设置cookie
app.use(cookieParser());

// 设置 Session
app.use(session({
    store: new RedisStore({
        host: config.REDIS_HOST,
        port: config.REDIS_PORT,
        ttl: config.REDIS_TTL, // 过期时间
        db: config.REDIS_DB_INDEX,
        prefix: config.REDIS_PREFIX,
        pass: config.REDIS_DB_PASS
    }),
    saveUninitialized: true,
    resave: true,
    secret: 'keyboard cat'
}));

//增加session
app.use(function(req, res, next){
    res.locals.session = req.session;
    next();
});

app.use("/static", express.static(path.join(__dirname, 'public')));
app.use("/flex", express.static(path.join(__dirname, 'views/flex')));

//登录验证
app.use('/', loginAuth);
app.use('/index', index);
app.use('/login', login);
app.use('/sign', sign);
app.use("/proxy", proxy);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    log.error("Something went wrong:", err);
    if(err.status == 404){
      res.status(err.status || 404);
      res.render('404.html', {
        message: err.message,
        error: err
      });       
    }else{
      res.status(err.status || 500);
      res.render('error.html', {
        message: err.message,
        error: err
      });      
    }

  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  log.error("Something went wrong:", err);
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

//module.exports = app;

//为了方便使用nodemon 增加如下代码
var debug = require('debug')('site:server'); // debug模块
app.set('port', process.env.PORT || config.SERVER_PORT); // 设定监听端口

//启动监听
var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});

//引入 socket.io 
var ioUtil = require('./utils/socket_util');
//启动 socket.io
ioUtil.listen(server);
