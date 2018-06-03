const expect = require('chai').expect;
const handler = require('../index').handler;
const AWS = require('aws-sdk-mock');
const common = require('common');
const dbConnector = common.DBConnector;

//Overwrite insert method
dbConnector.insert = function(collection, d, indexes) {
	if(d.nickname === 'juanito1'){
		let error = new Error("E11000 duplicate key error index: simple-api.persons.$id_person__id dup key: { : null }");
		error.code = 11000;
		throw error;
	}
	else{
		return { 
			insertedCount: 1,
			result: { ok: 1, n: 1 },
			connection: {},
			ops: 
			[d] 
		};
	}
};

dbConnector.findAndModify = function(collection, query, sort, set, options) {
	return { 
		lastErrorObject: { updatedExisting: true, n: 1 },
		value: { _id: 'personId', seq: 0 },
		ok: 1 
	};
};


describe('Suite test: Create person', ()=>{

	it('Create a person', (done)=>{
		const event = {
			"body": JSON.stringify(
			{
				"name": "Juan",
				"surname": "Buendia",
				"nickname": "juanito2"
			}
			)};
		try{
			handler(
			  event,
			{
				succeed: function(json){
					const body = JSON.parse(json.body);
        	expect(json.statusCode).to.equal(200);
        	expect(body).to.have.property('id').to.be.a('number').to.be.equal(1);
					expect(body).to.have.property('name').to.be.an('string').to.be.equal("Juan");
					expect(body).to.have.property('surname').to.be.an('string').to.be.equal("Buendia");
					expect(body).to.have.property('nickname').to.be.an('string').to.be.equal("juanito2");
				}
			}).then(()=>done());
		}catch(err){
			done(err);
		}
	});
	it('Create a person with same nickname', (done)=>{
		const event = {
			"body": JSON.stringify(
			{
				"name": "Pedro",
				"surname": "Jose",
				"nickname": "juanito1"
			}
			)};
		try{
			handler(
				event,
				{
					succeed: function(json){
						const body = JSON.parse(json.body);
						expect(json.statusCode).to.equal(400);
						expect(body).to.have.property('error').to.be.an('string').to.be.equal("Nickname already exists.");
					}
				}).then(()=>done());
		}catch(err){
			done(err);
		}
	});
});