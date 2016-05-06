exports.WEB_NAME = "palantir-web";
exports.DB_NAME = "operation-sys"; //数据库
exports.DB_HOST = "localhost"; //数据库地址
exports.DB_PORT = "3306"; //数据库端口
exports.DB_USER = "root"; //数据库用户名
exports.DB_PASSWORD = "root"; //数据库密码
exports.SERVER_PORT = 3001; //监听端口
exports.DATE_FORMAT = "YYYY-MM-DD HH:mm:ss"; //默认的日期格式
exports.DATE_FORMAT_DAY = "YYYY-MM-DD"; //默认的日期格式

//redis session相关配置
exports.REDIS_HOST = "localhost";
exports.REDIS_PORT = 6379;
exports.REDIS_TTL = 900;
exports.REDIS_DB_INDEX = 1;
exports.REDIS_DB_PASS = 1;
exports.REDIS_PREFIX = 'sess:';

//mongodb 相关配置
exports.MONGO_HOST = "54.222.206.70";
exports.MONGO_DBNAME = "log_db";
exports.MONGO_USER = "log_user";
exports.MONGO_PASSWORD = "prodaas_mongo";
exports.MONGO_PORT = 27017;

//后台数据服务的根路径地址
//exports.PALANTIR_URL = "http://192.168.1.206:8080/analysis-tools/";
exports.PALANTIR_URL = "http://192.168.1.206:8080/analysis-tools/";