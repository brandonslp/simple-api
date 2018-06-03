const common = require('common');
const dbConnector = common.DBConnector;
const async = require('asyncawait/async');
const await = require('asyncawait/await');

module.exports.PersonDao = function() {
	let modelName = "persons";
	this.create = async(function(person) {
		const index = [
			{
				key:{
					id: 1
				},
				name: "id_person__id",
				unique: true          
			},
			{
				key:{
					"nickname": 1
				},
				name: "nickname_person__nickname",
				unique: true          
			}
		];
		return await(dbConnector.insert(modelName,person,index));
	});
	this.sequenceNextValue = async(function() {
		return await(dbConnector.findAndModify('counters',
		{ "_id": "personId" },
		{},
		{ $inc: { seq: 1 } }));
	});
};