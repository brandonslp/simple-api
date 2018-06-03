module.exports = function(){
	switch( process.env.NODE_ENV ){
		case "dev":
		default:
		return {
			"database":{
				"uri": `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}?keepAlive=1&connectTimeoutMS=30000`,
				"dbName": process.env.MONGO_DB,
				"host": process.env.MONGO_HOST,
				"port": process.env.MONGO_PORT,
				"user": process.env.MONGO_USER,
				"password": process.env.MONGO_PASS
			}
		};
	}
};