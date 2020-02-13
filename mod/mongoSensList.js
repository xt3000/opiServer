const mongoose = require('mongoose');


const sensListSchema = mongoose.Schema({
  name: {
		type: String,			//door
	}
});


const sensList = module.exports = mongoose.model('sensList', sensListSchema);

const getNames = module.exports.getNames = function(callback){
  sensList.find({}, 'name', callback);
};

module.exports.addSens = function(sensName, callback){
  getNames(function(err, names){
    if(err) throw err;
    for (var i = 0; i<names.length; i++) {
      console.log("> " + names[i].name);
      if (names[i].name == sensName) return;
    }
    var sens = new sensList({name: sensName}).save(callback);
  });
};
