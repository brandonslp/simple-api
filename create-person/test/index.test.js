const expect = require('chai').expect;
const handler = require('../index').handler;
const AWS = require('aws-sdk-mock');
const common = require('common');
const dbConnector = common.DBConnector;

//Overwrite insert method
dbConnector.insert = function() {
	return { 
		insertedCount: 1,
		result: { ok: 1, n: 1 },
		connection: {},
		ops: 
		[ 
		{
			name: 'Pedro',
			surname: 'Jose',
			nickname: 'juanito1',
			id: 1
		}] 
	};
};


describe('Suite test: Create person', ()=>{

	it('Create a person', (done)=>{
		const event = {
			"body": JSON.stringify(
			{
				"name": "Juan",
				"surname": "Buendia",
				"nickname": "juanito1"
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
					expect(body).to.have.property('nickname').to.be.an('string').to.be.equal("juanito1");
				}
			}).then(()=>done());
		}catch(err){
			done(err);
		}
	});
});