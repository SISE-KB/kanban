var express = require('express')
   ,cookieParser = require('cookie-parser')
   ,bodyParser = require('body-parser')
   ,logger = require('morgan')
   ,session = require('express-session')
   ,debug = require('debug')('kb:main')
   ,config=require('./config')
   ,security=require('./security')


var app = express()
var server = require('http').createServer(app)
var io = require('socket.io')(server)
io.on('connection', function (socket) {
  debug('==connection==')
  socket.on('message', function (data) {
    socket.broadcast.emit('message', data)
  })
})

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(session({ 
	secret: config.server.cookieSecret,
	resave: false,
    saveUninitialized: true
 }))

security.initialize(app)
app.use("/api", require('./routes/data').addRoutes(app));
require('./routes/security').addRoutes(app, security);
require('./routes/static').addRoutes(app, config);

module.exports = server;


/*
var apiRoot="/api";
var users = require('./routes/user')(auth);
app.use(apiRoot, users);
var projects = require('./routes/project')(auth);
app.use(apiRoot, projects);
var messages = require('./routes/message')(auth);
app.use(apiRoot, messages);
*/
