var express = require('express')
   ,bodyParser = require('body-parser')
   ,logger = require('morgan')
   ,session = require('express-session')
   ,debug = require('debug')('kb:main')
   ,config=require('./config')
   ,security=require('./security')


var app = express()
var server = require('http').createServer(app)
/*var io = require('socket.io')(server)
io.on('connection', function (socket) {
  debug('==connection==')
  socket.on('message', function (data) {
    socket.broadcast.emit('message', data)
  })
})*/

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(session({ 
	secret: config.server.cookieSecret,
	resave: false,
    saveUninitialized: true
 }))

security.initialize(app)
app.use("/api", require('./routes/api').addRoutes(app));
app.use("/db", require('./routes/data').addRoutes(app));
require('./routes/security').addRoutes(app, security);
require('./routes/static').addRoutes(app, config);

module.exports = server;

