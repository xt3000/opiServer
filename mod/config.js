const session = require('express-session');
const fileStore = require('session-file-store')(session);



// настройка fileStore (fsOptions)
fsOptions = {
  minTimeout: 0,
  maxTimeout: 1,
  ttl: 864000,
  retries: 2,
  reapAsync: false,
  reapSyncFallback: false
}

// настройка сессий
module.exports.sessOptions = {
  store: new fileStore(fsOptions),
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

//настройка Базы Данных
module.exports.mongo = {
  db: 'mongodb://mongo-root:32842004@192.168.0.3:27017/ihome',
  secret: 'iFinch_dev'
}
