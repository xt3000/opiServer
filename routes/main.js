const express = require('express');
const passport = require('passport');
const router = express.Router();
const path = require('path');


router.get('/', function(req, res){
  console.log('get route: /');
  if(req.isAuthenticated()){
    console.log('.isAuthenticated DONE');
    res.sendFile(path.normalize(__dirname + '/..//index.html'));
  }else{
    console.log('isAuthenticated FALSE');
    res.redirect('/login');
  }
});

//.../login
router.get('/login', function(req, res) {
console.log('GET route: /login');
res.sendFile(path.normalize(__dirname + '/..//login.html'));
});



router.post('/login', function(req, res, next){
console.log('POST route: /login');
passport.authenticate('local', function(err, user, info){
  if(info) {return res.send(info.message)}
  if (err) { return next(err); }
  if (!user) { return res.redirect('/login'); }
  req.login(user, function(err){
    if (err) { return next(err); }
    return res.redirect('/');
  })
})(req, res, next);
});

module.exports = router;
