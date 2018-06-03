const common = require('common');
const dbConnector = common.DBConnector;
const async = require('asyncawait/async');
const await = require('asyncawait/await');

module.exports.PersonDao = function() {
	let modelName = "persons";
	this.getAll = async(function() {
		return await(dbConnector.find(modelName));
	});
};