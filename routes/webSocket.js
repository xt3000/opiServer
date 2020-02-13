const express = require('express');
const app = express();
const router = express.Router();
const expressWs = require('express-ws')(app);


//******* WS *******

  //...onConnect()
router.ws('/ws', function(ws, req) {
  const params = url.parse(req.url, true);
  console.log('ws: open(type: ' + params.query.type + ')');


  if (params.query.type === 'interface') {
    console.log('WS: Interface');                                   //***подключен 'интерфейс'***
    ws.mType = params.query.type;
    interfaces.push(ws);

    // read DB...
    mongoose.connection.db.listCollections().toArray(function (err, names) {    //Читаем последние показания всех датчиков
      for (var i=0; i<names.length; i++) {
        var mModel = mongoose.model(names[i].name, mongoSet.mSchema);
        mModel.findOne().sort('-_id').exec(function(err, resolt){
        	if (err) throw err;
          if (resolt != null) ws.send(JSON.stringify(resolt));
        });
      };
    }); // ...read DB
  } else if (params.query.type === 'sensor') {
    console.log('WS: Sensor');                                   //***подключен 'Сенсор'***
    ws.mType = params.query.type;
    ws.mID = params.query.id;
    sensors.push(ws);
  } else {
    ws.close();                                                   //***усройство не распознано***
  }

  //...onMassage()
  ws.on('message', function(msg) {
    var str = JSON.parse(msg);
    str.name = str.id;
    delete str.id;

    console.log('WS: massage from ' + str.type);
    console.log('JSON > type: ' + str.type);
    if (str.type === 'sensor') {
      if(str.req === true){                                           //***Сенсор запрашивает данные
        var mModel = mongoose.model(str.name, mongoSet.mSchema);
        mModel.findOne().sort('-_id').exec(function(err, resolt){
        	if (err) throw err;
          console.log('SEND for sensor:');
        	console.log(JSON.stringify(resolt));
          console.log('');
        	if (resolt != null) ws.send(JSON.stringify(resolt));
          else ws.send("{}");
        });
      }
      else{                                                             //***Сенсор передаёт данные
          var mModel = mongoose.model(str.name, mongoSet.mSchema);      //Сохраняем в БД
          var sens = new mModel(str);
          sens.save();
          console.log('Send: ok');
          ws.send('ok');                                   //Ответ сенсору 'ok'

          for(var i = 0; i < interfaces.length; i++){     //Передаём интерфейсам полученные данные
            if(interfaces[i].readyState != ws.OPEN){
              console.log('Client state is ' + interfaces[i].readyState);
              interfaces[i].close();
              interfaces.splice(i, 1);
            } else {
              console.log('ws: send new to all interfaces');
              console.log(str);
              interfaces[i].send(JSON.stringify(str));
              }
          }
      }

    }

  });

  //...onClose()
  ws.on('close', function(ws) {
    console.log('ws: close');
  });

}); // ..app.ws('/ws', ...){...}


module.exports = router;
