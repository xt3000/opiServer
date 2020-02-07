const mongoose = require('mongoose');


//настройка Базы Данных
module.exports.db = 'mongodb://finch:3284@127.0.0.1:27017/ihome';
module.exports.options = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	 // bufferCommands: false									// буферизация команд
};

module.exports.mSchema = mongoose.Schema({
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
	piople: {
		type: Number
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
