const mongoose = require('mongoose');


//настройка Базы Данных
module.exports.db = 'mongodb://finch:3284@127.0.0.1:27017/ihome';
module.exports.options = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	 // bufferCommands: false									// буферизация команд
};
