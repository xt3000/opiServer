// const fileStore = require('session-file-store')(session);



// настройка fileStore (fsOptions)
module.exports.fsOptions = {
  minTimeout: 0,
  maxTimeout: 1,
  ttl: 864000,
  retries: 2,
  reapAsync: false,
  reapSyncFallback: false
}

// настройка сессий
// module.exports.sessOptions = {
//   store: new fileStore(fsOptions),
//   name: "__fid",
//   secret: "iHome from Finch",
//   resave: true,
//   saveUninitialized: true,
//   cookie: {
//     httpOnly: true,
//     path: "/",
//     maxAge: 864000000
//   }
// }

//настройка Базы Данных
module.exports.mongo = {
  db: 'mongodb://localhost:27017/ihome',
  secret: 'iFinch_dev'
}
