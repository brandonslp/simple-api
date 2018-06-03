const common = require('common');
const Utils = common.Utils;
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const PersonDao = require('./dao/person-dao').PersonDao;


let toResponse = function(code, message){
	return {
		"statusCode": code,
		"headers": {
			"Content-Type": "application/json"
		},
		"body": JSON.stringify(message)
	};
};

exports.handler = async(function(event, context, callback){
	context.callbackWaitsForEmptyEventLoop = false;
	let output = {};
	try{
		const id = event.pathParameters.id;
		console.log('INPUT: ', JSON.stringify(event));
		let personDao = new PersonDao();
		const result = await(personDao.find(id));
		console.log('MONGO RESULT: ', result);
		output = toResponse(200, result);
	}catch(exc){
		console.log(exc);
		console.log("Exception: "+exc.message);
		output = toResponse(500, exc.message);
	}finally{
		console.log('OUTPUT: ', JSON.stringify(output));
		context.succeed(output);
	}  
});