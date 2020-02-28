const mongoose = require('mongoose');
const mongoSensList = require('../mod/mongoSensList');

const sensSchema = mongoose.Schema({
	name: {
		type: String			//door
	},
	place: {
		type: String			//k3
	},
	type: {
		type: String			//sensor
	},
	sw1: {
		type: Boolean
	},
	sw2: {
		type: Boolean
	},
	people: {
		type: Number
	},
	auto: {
		type: Boolean			//Опция сенсора (resol добавляется перед отправкой из переменной)
	},
	temp: {
		type: Number
	},
	pres: {
		type: Number
	},
	hum: {
		type: Number
	},
	alt: {
		type: Number
	},
	inDate: {
		type: Date,
		default: Date.now
	}
});


const Sensors = module.exports = mongoose.model('sens', sensSchema);

const findSens = module.exports.findSens = function(sensName, sensPlace, limit, callback){
	var query = {name: sensName};
	if (sensPlace != '') query.place = sensPlace;
	Sensors.find(query).sort('-_id').limit(limit).exec(callback);
};

module.exports.addSens = function(sensData, callback){
	var sens = new Sensors(sensData).save(callback);
	// sens.save(callback);
};

module.exports.readAllLastest = function(callback){
	mongoSensList.getNames(function(err, names){
		if (err) throw err;
		for (var i = 0; i<names.length; i++) {
			findSens(names[i].name, '', 1, callback);
    }
	});
};









	/*
	const sModel = require('./mod/mongoSet');

	var sens = new sModel(str);
	sModel.addSens(sens, function(err, data){
		if(err) throw err;
	});

	*/
