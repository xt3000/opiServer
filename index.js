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
const mongoose = require('mongoose');



const sessOptions = {
  store: new fileStore(config.fsOptions),
  name: "__fid",
  secret: "iHome from Finch",
  resave: true,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    path: "/",
    maxAge: 864000000
  }
}
const interfaces = [];
const sensors = [];
const user = {
  id: "f3i2n8c4h",
  login: "finch",
  pass: "3284"
};

//...middleware

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
app.use(session(sessOptions));
app.use(passport.initialize());
app.use(passport.session());
//.......................

// Подключение к MongoDB
mongoose.connect(config.mongo.db, { useNewUrlParser: true });

mongoose.connection.on('connected', () => {
  console.log("DB Connected!")
})

mongoose.connection.on('error', (err) => {
  console.log("DB Connection ERROR: " + err)
})
//.......................


//...routes
  //.../home

app.get('/', function(req, res){
  console.log('get route: /');
  console.log('session: ' + JSON.stringify(req.session));
  if(req.isAuthenticated()){
    console.log('.isAuthenticated DONE');
    console.log('req.user: ' + JSON.stringify(req.user));
    console.log('req.user: ' + JSON.stringify(req.session.passport.user));
    res.sendFile(__dirname + '/index.html');
  }else{
    console.log('isAuthenticated FALSE');
    console.log('req.user: ' + JSON.stringify(req.user));
    console.log('req.passport: ' + JSON.stringify(req.session.passport));
    res.redirect('/login');
  }
});

  //.../login
app.get('/login', function(req, res) {
  console.log('GET route: /login');
  console.log('sid: ' + req.sessionID);
  res.sendFile(__dirname + '/login.html');
});



app.post('/login', function(req, res, next){
  console.log('POST route: /login');
  passport.authenticate('local', function(err, user, info){
    if(info) {return res.send(info.message)}
    if (err) { return next(err); }
    if (!user) { return res.redirect('/login'); }
    req.login(user, function(err){
      console.log('.login:');
      if (err) { return next(err); }
      return res.redirect('/');
    })
  })(req, res, next);
});





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

    fs.readdir(__dirname+'/res/history/', function(err, items) {
      if (err) throw err;
      for (var i=0; i<items.length; i++) {
        var data = fs.readFileSync(__dirname+'/res/history/'+items[i],'utf8')
        ws.send(data);
      }
    });

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

    console.log('ws: massage');
    console.log('JSON > type: ' + str.type);
    console.log(' ');
    if (str.type === 'sensor') {
      var fileName = __dirname+'/res/history/'+str.id+'.his';
      if(str.req === true){                                 //Сенсор запрашивает данные
        var data = fs.readFileSync(fileName,'utf8')
        console.log('Send: data');
        ws.send(data);
      }
      else{                                                 //Сенсор передаёт данные
          var d = new Date();                               //Добавляем в данные время получения
          console.log('Date: ' + d);
          console.log(str.id);
          str.inDate = d;
          console.log(str.inDate);
          fs.writeFile(fileName, JSON.stringify(str), function(err) { //Сохраняем
            if(err) throw err;
          });

          console.log('Send: ok');
          ws.send('ok');                                   //Ответ сенсору 'ok'

          for(var i = 0; i < interfaces.length; i++){     //Передаём интерфейсам полученные данные
            if(interfaces[i].readyState != ws.OPEN){
              console.log('Client state is ' + interfaces[i].readyState);
              interfaces[i].close();
              interfaces.splice(i, 1);
            } else {
              console.log('ws: send');
              console.log(JSON.stringify(str));
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

});

app.listen(8080);
console.warn('Server started');

// доп функции...

function wsSendAll(msg) {

}
