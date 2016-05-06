var mongoose = require('mongoose');
var config = require('../config/config');
var connection = mongoose.createConnection('mongodb://'+ config.MONGO_HOST +':'+ config.MONGO_PORT +'/' + config.MONGO_DBNAME,{
  server : { poolSize: 20 },
  user: config.MONGO_USER,
  pass: config.MONGO_PASSWORD
});

var Schema = mongoose.Schema;

var LogSchema = new Schema({
  api_url: String,
  api_params: Object,
  client_ip: String,
  access_time: Date,
  key_value: String,
  res_code: String,
  cost_time: String,
  user_id: String
});

//var connection = mongoose.createConnection('mongodb://localhost:27017/db');
//var Tank = connection.model('Tank', yourSchema);

exports.AccessLog = connection.model('access_log', LogSchema);
exports.mongoose = mongoose;