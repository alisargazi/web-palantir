var Sequelize = require("sequelize");
var config = require("../config/config");
var moment = require("moment");

//数据库连接
var sequelize = new Sequelize(config.DB_NAME, config.DB_USER, config.DB_PASSWORD, {
  host: config.DB_HOST,
  dialect: 'mysql',
  timezone:'+08:00',
  pool: {
    max: 10,
    min: 0,
    idle: 10000
  },
});

//------------------
//------------------
//定义部分

//用户表
exports.User = sequelize.define(
	"User",
	{
    id: {
      type: Sequelize.STRING,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    login_name: Sequelize.STRING,
    password: Sequelize.STRING,
    user_role: Sequelize.STRING,
    create_time: {
      type: Sequelize.DATE,
      defaultValue: moment().format(config.DATE_FORMAT),
      get: function(){
        return moment(this.getDataValue('create_time')).format(config.DATE_FORMAT);
      }
    },
    last_modify_time: {
      type: Sequelize.DATE,
      defaultValue: moment().format(config.DATE_FORMAT),
      get: function(){
        return moment(this.getDataValue('last_modify_time')).format(config.DATE_FORMAT);
      }
    },
    day_searchs: Sequelize.INTEGER,
    last_search_time: {
      type: Sequelize.DATE,
      get: function(){
        return moment(this.getDataValue('last_search_time')).format(config.DATE_FORMAT);
      },
    },
    day_searchs_max: Sequelize.INTEGER,
    expiration_time: {
      type: Sequelize.DATE,
      get: function(){
        return moment(this.getDataValue('expiration_time')).format(config.DATE_FORMAT);
      }
    },
    email: Sequelize.STRING,
    phone: Sequelize.STRING,
    searchs_max: Sequelize.INTEGER,
    current_searchs: Sequelize.INTEGER,
    account_status: Sequelize.INTEGER 
	},
	{
		tableName: "u_users",
		timestamps: false
	}
);



//系统日志
exports.SysLoginLog = sequelize.define(
	"SysLoginLog",
	{
    id: {
      type: Sequelize.STRING,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    user_id: Sequelize.STRING,
    operation_flag: Sequelize.STRING,
    client_ip: Sequelize.STRING,
    operation_time: {
      type: Sequelize.DATE,
      get: function(){
        return moment(this.getDataValue('operation_time')).format(config.DATE_FORMAT);
      }
    }
	},
	{
		tableName: "sys_login_log",
		timestamps: false
	}
);


//接口访问日志表
exports.ApiAccessLog = sequelize.define(
	"ApiAccessLog",
	{
    id: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    api_url: Sequelize.STRING,
    api_params: Sequelize.STRING,
    client_ip: Sequelize.STRING,
    access_time: {
      type: Sequelize.DATE,
      get: function(){
        return moment(this.getDataValue('access_time')).format(config.DATE_FORMAT);
      }
    },
    key_value: Sequelize.STRING,
    res_code: Sequelize.STRING,
    cost_time: Sequelize.INTEGER
	},
	{
		tableName: "api_access_log",
		timestamps: false
	}
);


exports.sequelize = sequelize;
