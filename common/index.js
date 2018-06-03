let Config = require('./lib/config/configuration');
module.exports.config = new Config();
module.exports.Utils = require('./lib/utils/util');
module.exports.DBConnector = require('./lib/connector/mongodb-connector');