/**
 * @credits to rmesino
 * @fork brandonslp
 * DB Connector
 */
const MongoClient = (process.env.ENV === 'test') ? require('mongo-mock').MongoClient : require('mongodb').MongoClient;
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const Config = require('./../config/configuration');
const config = new Config();

const url = config.database.uri;
let client = null;

exports.connect = async(function() {
	if( client === null ){
		client = await( MongoClient.connect(url) );
	}
});

exports.getCollection = function(collection){
	await( exports.connect() );
	return client.db(config.database.dbName).collection(collection);
};

exports.insert = async(function(collection, document, indexes){
	await( exports.connect() );
	let coll = client.db(config.database.dbName).collection(collection);
	let insResult =  await( coll.insert(document) );
	if( indexes ){
		await( coll.createIndexes(indexes) );
	}
	return insResult;
});

exports.aggregate = async(function(collection, pipeline){
	await(exports.connect());
	let coll = client.db(config.database.dbName).collection(collection);
	let cursor = coll.aggregate(pipeline,{allowDiskUse:true});
	return await(cursor.toArray());
});

exports.find = async(function(collection, query){
	await(exports.connect());
	let coll = client.db(config.database.dbName).collection(collection);
	let cursor = coll.find(query);
	return await(cursor.toArray());
});

exports.findOne = async(function(collection, query){
	await(exports.connect());
	let coll = client.db(config.database.dbName).collection(collection);
	return await(coll.findOne(query));
});

exports.findAndModify = async(function(collection, query, sort, set, options){
	await(exports.connect());
	let coll = client.db(config.database.dbName).collection(collection);
	return await(coll.findAndModify(query, sort, set, options));
});

exports.findAndOrder = async(function(collection, query, orderBy){
	await(exports.connect());
	let coll = client.db(config.database.dbName).collection(collection);
	let cursor = coll.find(query).sort(orderBy);
	return await(cursor.toArray());
});

exports.findWLimit = async(function(collection, query, _limit, orderBy){
	await(exports.connect());
	let coll = client.db(config.database.dbName).collection(collection);
	let cursor = coll.find(query).limit(_limit).sort(orderBy);
	return await(cursor.toArray());
});

exports.projectionFind = async(function(collection, query, projection, orderBy, skip, limit){
	await(exports.connect());
	let coll = client.db(config.database.dbName).collection(collection);
	let cursor = coll.find(query, projection).skip( skip ? skip : 0 ).limit( limit ? limit : 0 );
	return await(cursor.toArray());
});

exports.count = async(function(collection, query){
	await(exports.connect());
	let coll = client.db(config.database.dbName).collection(collection);
	let cursor = coll.find(query, projection).skip( skip ? skip : 0 ).limit( limit ? limit : 0 );
	return await(coll.count(query));
});

exports.update = async(function(collection, query, set){
	await(exports.connect());
	let coll = client.db(config.database.dbName).collection(collection);
	return await(coll.update(query, set));
});

exports.upsert = async(function(collection, query, set, indexes){
	await(exports.connect());
	let coll = client.db(config.database.dbName).collection(collection);
	if( indexes ){
		await( coll.createIndexes(indexes) );
	}
	return await(coll.update(query, set, {upsert: true}));
});

exports.updateMany = async(function(collection, query, set){
	await(exports.connect());
	let coll = client.db(config.database.dbName).collection(collection);
	return await(coll.updateMany(query, set));
});

exports.removeOne = async(function(collection, query){
	await(exports.connect());
	let coll = client.db(config.database.dbName).collection(collection);
	return await(coll.removeOne(query));
});

exports.removeMany = async(function(collection, query){
	await(exports.connect());
	let coll = client.db(config.database.dbName).collection(collection);
	return await(coll.removeMany(query));
});

exports.drop = async(function(collection){
	await(exports.connect());
	let coll = client.db(config.database.dbName).collection(collection);
	return await(coll.drop());
});

exports.bulkUpsert = async(function(collection, documents, indexes){
	await(exports.connect());
	let coll = client.db(config.database.dbName).collection(collection);
	let bulk = coll.initializeUnorderedBulkOp({useLegacyOps: true});
	documents.forEach(function(doc){
		bulk.find(doc.find).upsert().update(doc.update);
	});
	if( indexes ){
		await( coll.createIndexes(indexes) );
	}
	return await(bulk.execute());
});

exports.bulkUpdate = async(function(collection, documents){
	await(exports.connect());
	let coll = client.db(config.database.dbName).collection(collection);
	let bulk = coll.initializeUnorderedBulkOp({useLegacyOps: true});
	documents.forEach(function(doc){
		bulk.find(doc.find).update(doc.update);
	});
	return await(bulk.execute());
});
