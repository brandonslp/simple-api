process.env.MONGO_DB = "test";
process.env.MONGO_HOST = "localhost";
process.env.MONGO_PORT = "2700";
process.env.MONGO_USER = "user";
process.env.MONGO_PASS = "pass";

const expect = require('chai').expect;
const handler = require('../index').handler;
const AWS = require('aws-sdk-mock');
const common = require('common');
const dbConnector = common.DBConnector;
const async = require('asyncawait/async');
const await = require('asyncawait/await');

describe('Suite test: get all person', ()=>{

	it('Get All', (done)=>{
		const event = {};
		try{
			insert().then(()=>{
				handler(
					event,
					{
						succeed: function(json){
							const body = JSON.parse(json.body);
							expect(json.statusCode).to.equal(200);
							expect(body).to.have.property('data').to.be.an('array')
							expect(body.data[0]).to.have.property('id').to.be.a('number').to.be.equal(1);
							expect(body.data[0]).to.have.property('name').to.be.a('string').to.be.equal("Juan");
							expect(body.data[0]).to.have.property('surname').to.be.a('string').to.be.equal("Buendia");
							expect(body.data[0]).to.have.property('nickname').to.be.a('string').to.be.equal("juanito1");
						}
					}).then(()=>done());
			});
		}catch(err){
			done(err);
		}
	});
});

let insert = async((client, storeId, routes) => {
	await(dbConnector.insert("persons", 
	{
		"name" : "Juan",
		"surname" : "Buendia",
		"nickname" : "juanito1",
		"id" : 1
	}
	));
});