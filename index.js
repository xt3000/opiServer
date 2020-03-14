const express = require('express')
const app = express()
const expressWs = require('express-ws')(app)
//const fs = require('fs');
const url = require('url')
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const fileStore = require('session-file-store')(session)
const config = require('./mod/config')
const mongoSet = require('./mod/mongoSet')
const mongoose = require('mongoose')
const main = require('./routes/main')
const mongoSens = require('./mod/mongoSens')
const mongoSensList = require('./mod/mongoSensList')
// const webSocket = require('./routes/webSocket')



// ...VARIBLES...
var resol_auto = true;    //// TODO: прописать функцию управления переменной (перманентно, по времени суток, ...)
const interfaces = []
const sensors = []
const user = {
  id: "f3i2n8c4h",
  login: "finch",
  pass: "3284"
}

//...MIDDLEWARE...

//...passport strtegy
passport.use(new LocalStrategy({usernameField: 'login'},
      function(login, password, done) {
        if(login === user.login && password === user.pass){
          return done(null, user)
        } else {
          return done(null, false)
        }
}));
passport.serializeUser(function(user, done) {                    //User id is save to the session file store here
  done(null, user.id)
});
passport.deserializeUser(function(id, done){
  if(user.id === id){
    done(null, user);
  }else {
    done(null, false);
  }
});
//.......................

app.use('/res', express.static('res'));
app.use('/update', express.static('update'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(session(config.sessOptions));
app.use(passport.initialize());
app.use(passport.session());
//.......................

// Подключение к MongoDB
mongoose.connect(mongoSet.db, mongoSet.options);
mongoose.connection.on('connected', () => {
  console.log("DB Connected!")
});
mongoose.connection.on('error', (err) => {
  console.log("DB Connection ERROR: " + err)
});
//.......................


//...routes
app.use('/', main);
// app.use('/ws', webSocket);

//******* WS *******

  //...onConnect()
app.ws('/ws', function(ws, req) {
  const params = url.parse(req.url, true);
  console.log('WS: open(type: ' + params.query.type + ')');

  if (params.query.type === 'interface') {                                      //***подключен 'интерфейс'***
    ws.mType = params.query.type;
    interfaces.push(ws);

    mongoSens.readAllLastest(function(err, resolt){                      //  ..Read DB all
      if (err) throw err;
      if (resolt != null) ws.send(JSON.stringify(resolt[0]));
    });

  } else if (params.query.type === 'sensor') {                                  //***подключен 'Сенсор'***
    ws.mType = params.query.type;
    if (params.query.id && params.query.id != undefined) ws.mName = params.query.id;
    else ws.mName = params.query.name;
    ws.mPlace = params.query.place;
    sensors.push(ws);
  } else {
    ws.close();                                                                 //***усройство не распознано***
  }

  //...onMassage()
  ws.on('message', function(msg) {
    var str = JSON.parse(msg);
    if(str.id != undefined){
      str.name = str.id;
      delete str.id;
    };

    console.log('WS: massage from ' + str.type);
    console.log(str);
    if (str.type === 'sensor') {                                                // +++СООБЩЕНИЕ ОТ СЕНСОРА+++
      if(str.command === "req"){                                                     //***Сенсор запрашивает данные
        mongoSens.findSens(str.name, str.place, 1, function(err, resolt){
          if (err) throw err;
          if (resolt.length != 0) {
            let r = resolt[0].toObject({versionKey: false});
            delete r._id;
            delete r.inDate;
            r.resol = resol_auto;
            console.log('WS: SEND for sensor:\n' + JSON.stringify(r, null, 2));
            ws.send(JSON.stringify(r));
          }
        })
      }
      else if (str.command === "debug") {                                       //***Сенсор передаёт DEBUG сообщение
        console.error('>>   DEBUG SENSOR('+str.name+'_'+str.place+'): '+str.msg);
      }
      else{                                                                      //***Сенсор передаёт данные
          mongoSensList.addSens(str.name, function(err, sens){           //..Сохраняем в БД
            if(err) throw err;
            else console.log('DB: sensName is added');
          });
          mongoSens.addSens(str, function(err, sens){
            if(err) throw err;
            else console.log('DB: sensData is added \n');
          });
          console.log('Send: ok');
          ws.send('ok');                                                //Ответ сенсору 'ok'

          for(var i = 0; i < interfaces.length; i++){                   //Передаём интерфейсам полученные данные
            if(interfaces[i].readyState != ws.OPEN){
              interfaces[i].close();
              interfaces.splice(i, 1);
            } else {
                console.log('ws: send new to all interfaces');
                interfaces[i].send(JSON.stringify(str));
              }
          }
      }

    }
    else {                                                                       // +++СООБЩЕНИЕ ОТ ИНТЕРФЕЙСА+++
      // TO-DO...
      if (str.command == 'req') {
        // TO-DO...
      }else if (str.command == 'setOptions') {
        // TO-DO...
      }else if (str.command == 'getOptions') {
        // TO-DO...
      }else if (str.command == 'upd') {
        // TO-DO...
        var s_found = false;
        for(var i = 0; i < sensors.length; i++){
          if (sensors[i].mName == str.name && sensors[i].mPlace == str.place) {
            if(sensors[i].readyState != ws.OPEN){
              sensors[i].close();
              sensors.splice(i, 1);
              continue;
            }
            s_found = true
            console.warn('SENSOR: ' + str.name + '_' + str.place + ' take WebUpdate.');
            sensors[i].send('upd');
          }
        }
        if (s_found == false) console.warn('SENSOR: ' + str.name + '_' + str.place + ' NOT found');
      }
    }

  });

  //...onClose()
  ws.on('close', function(ws) {
    console.log('ws: close');
  });

}); // ..app.ws('/ws', ...){...}

app.listen(8080);
console.warn('Server started');
