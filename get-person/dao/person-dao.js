const common = require('common');
const dbConnector = common.DBConnector;
const async = require('asyncawait/async');
const await = require('asyncawait/await');

module.exports.PersonDao = function() {
	let modelName = "persons";
	this.find = async(function(id) {
		return await(dbConnector.findOne(modelName,{
			"id": id
		}));
	});
};