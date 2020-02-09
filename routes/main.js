const express = require('express');
const passport = require('passport');
const router = express.Router();
const path = require('path');

router.get('/', function(req, res){
  console.log('get route: /');
  console.log('session: ' + JSON.stringify(req.session));
  if(req.isAuthenticated()){
    console.log('.isAuthenticated DONE');
    console.log('req.user: ' + JSON.stringify(req.user));
    console.log('req.user: ' + JSON.stringify(req.session.passport.user));
    res.sendFile(path.normalize(__dirname + '/..//index.html'));
  }else{
    console.log('isAuthenticated FALSE');
    console.log('req.user: ' + JSON.stringify(req.user));
    console.log('req.passport: ' + JSON.stringify(req.session.passport));
    res.redirect('/login');
  }
});

//.../login
router.get('/login', function(req, res) {
console.log('GET route: /login');
console.log('sid: ' + req.sessionID);
res.sendFile(path.normalize(__dirname + '/..//login.html'));
});



router.post('/login', function(req, res, next){
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

module.exports = router;
