const express = require('express')
const app = express()
const expressWs = require('express-ws')(app)
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
const webSocket = require('./routes/webSocket')



// ...VARIBLES...
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
app.use('/ws', webSocket);


app.listen(8080);
console.warn('Server started');
