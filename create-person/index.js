const common = require('common');
const Utils = common.Utils;
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const schema = require('./schema.json');
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
		let body = JSON.parse(event.body);
		let validation = Utils.validateSchema(body, schema);
		console.log('INPUT: ', JSON.stringify(event));
		if(validation.valid){
			let personDao = new PersonDao();
			const result = await(personDao.create(body));
			console.log('MONGO RESULT: ', result);
			body.id = result.ops[0].id;
			output = toResponse(200, body);
		}else
			throw new Error(Utils.buildSchemaErrorsMessage(validation.errors));
	}catch(exc){
		console.log("Exception: "+exc.message);
		output = toResponse(500, exc.message);
	}finally{
		console.log('OUTPUT: ', JSON.stringify(output));
		context.succeed(output);
	}  
});