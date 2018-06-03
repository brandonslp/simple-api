const ObjectID = require('mongodb').ObjectID;
const Validator = require('jsonschema').Validator;
const v = new Validator();

/** @returns {valid: true|false, errors: [], }*/
exports.validateSchema = function(json, schema){
	if( !json || !schema )return {valid: false, errors: ["Can't validate schema, null arguments"]};
	let validation = v.validate(json, schema);
	return {valid: validation.errors && validation.errors.length === 0, errors: validation.errors};
};

exports.buildSchemaErrorsMessage = function(errors){
	let error = {};
	if( errors && errors.length > 0 ){
		error.message = "";
		errors.forEach(function(err){
			if( error.message !== "" ){
				error.message += ", ";
			}
			error.message += err;
		});
	}
	return error.message;
};

exports.objectToDotNotation = function(obj, target, prefix) {
  target = target || {},
  prefix = prefix || "";
  Object.keys(obj).forEach(function(key) {
    if ( typeof(obj[key]) === "object" ) {
      exports.objectToDotNotation(obj[key],target,prefix + key + ".");
    } else {
      return target[prefix + key] = obj[key];
    }
  });
  return target;
};

exports.toObjectId = (_id)=>{
	try{
		return _id instanceof ObjectID ? _id : new ObjectID(_id);
	}catch(exc){
		return _id;
	}
};