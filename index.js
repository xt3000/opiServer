const express = require('express');
const app = express();
const expressWs = require('express-ws')(app);
const fs = require('fs');
const url = require('url');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const fileStore = require('session-file-store')(session);
const config = require('./mod/config');
const mongoSet = require('./mod/mongoSet');
const mongoose = require('mongoose');
const main = require('./routes/main');



// ...VARIBLES...
const interfaces = [];
const sensors = [];
const user = {
  id: "f3i2n8c4h",
  login: "finch",
  pass: "3284"
};

//...MIDDLEWARE...

//...passport strtegy
passport.use(new LocalStrategy({usernameField: 'login'},
      function(login, password, done) {
        console.log('.LocalStrategy()');
        if(login === user.login && password === user.pass){
          console.log('LStrategy return: true');
          return done(null, user)
        } else {
          console.log('LStrategy return: false');
          return done(null, false)
        }
}));
passport.serializeUser(function(user, done) {
  console.log('.serializeUser()'); //User id is save to the session file store here
  done(null, user.id)
});
passport.deserializeUser(function(id, done){
  console.log('.deserializeUser():')
  if(user.id === id){
    console.log('...deserializeUser DONE');
    done(null, user);
  }else {
    console.log('...deserializeUser FALSE');
    done(null, false);
  }
});
//.......................

app.use('/res', express.static('res'));
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

// var idoor = {
//   name: 'doorsens',
// 	place: 'k3',
// 	type: 'sensor',
// 	sw1: true,
// 	sw2: false,
// 	piople: 3
// };
// var mModel = mongoose.model(idoor.name, mongoSet.mSchema);
// var sens = new mModel(idoor);
// sens.save();
//.......................


//...routes
app.use('/' , main);

//******* WS *******

  //...onConnect()
app.ws('/ws', function(ws, req) {
  const params = url.parse(req.url, true);
  console.log('ws: open(type: ' + params.query.type + ')');


  if (params.query.type === 'interface') {

  	//..подключен 'интерфейс'
    console.log('ws.mType');
    ws.mType = params.query.type;
    console.log('interface.push(ws)');
    interfaces.push(ws);
    console.log('interfaces.length: ' + interfaces.length);

    // fs.readdir(__dirname+'/res/history/', function(err, items) {
    //   if (err) throw err;
    //   for (var i=0; i<items.length; i++) {
    //     var data = fs.readFileSync(__dirname+'/res/history/'+items[i],'utf8')
    //     ws.send(data);
    //   }
    // });

    // test read DB...
    mongoose.connection.db.listCollections().toArray(function (err, names) {
      console.log("DB names:");
      for (var i=0; i<names.length; i++) {
        console.log(names[i].name);
        var mModel = mongoose.model(names[i].name, mongoSet.mSchema);
        mModel.findOne().sort('-_id').exec(function(err, resolt){
        	if (err) throw err;
          console.log('SEND for interface:');
        	console.log(JSON.stringify(resolt));
          console.log('');
          if (resolt != null) ws.send(JSON.stringify(resolt));
        });
      };

    });
    // ...test

  } else if (params.query.type === 'sensor') {

  	//...подключен 'сенсор'
    ws.mType = params.query.type;
    ws.mID = params.query.id;
    sensors.push(ws);
    console.log('sensors.length: ' + sensors.length);
  } else {
    ws.close(); //..усройство не распознано
  }

  //...onMassage()
  ws.on('message', function(msg) {
    var str = JSON.parse(msg);
    str.name = str.id;
    delete str.id;

    console.log('ws: massage');
    console.log('JSON > type: ' + str.type);
    console.log(' ');
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

app.listen(8080);
console.warn('Server started');

// доп функции...
