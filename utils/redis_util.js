var config = require("../config/config");

var redis = require("redis");
var client = redis.createClient({
  host: config.REDIS_HOST,
  port: config.REDIS_PORT,
  db: config.REDIS_DB_INDEX,
  password: config.REDIS_DB_PASS  
});

module.exports = client;
