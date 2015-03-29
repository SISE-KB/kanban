'use strict';

var express = require('express'),
     mongoose = require('mongoose'),
     path = require('path'),
     os = require('os'),
     fs = require('fs'),
     cookieParser = require('cookie-parser'),
     bodyParser = require('body-parser'),
     logger = require('morgan'),
     session = require('express-session'),
     debug = require('debug')('kb:main'),
     passport = require('passport'),
     busboy = require('busboy'),
     LocalStrategy = require('passport-local').Strategy;

var Account = require('./models/User');
var databaseURI = 'mongodb://localhost/kanban_db';

mongoose.connect(databaseURI, function(err) {
  if (err) {
    debug(databaseURI + ' connection error. ', err);
    throw(err);
  } else /*if(process.env.NODE_ENV === 'development')*/{
    debug(databaseURI + ' connected.');
  }
});

var auth = function(req, res, next){
  if (!req.isAuthenticated()) 
  	res.status(401);
  else
  	next();
};
var uploadHandler=function(req, res) {
    var boy = new busboy({ headers: req.headers });
    boy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      var saveTo = path.join(__dirname+"/public/upload", path.basename(filename));//os.tmpDir()
      file.pipe(fs.createWriteStream(saveTo,{flags: 'w'}));
      console.log(saveTo);
    });
    boy.on('finish', function() {
      res.writeHead(200, { 'Connection': 'close' });
      res.end("That's all folks!");
    });
    return req.pipe(boy);
}



var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
io.on('connection', function (socket) {
  debug('==connection==');
  // when the client emits 'new message', this listens and executes
  socket.on('message', function (data) {
    // we tell the client to execute 'new message'
    //debug(data);
    socket.broadcast.emit('message', data);
  });
});


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ 
	secret: 'alex^gdh&',
	resave: false,
    saveUninitialized: true
 }));

app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(path.join(__dirname, 'upload')));


// Configure passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Configure passport-local to use account model for authentication
//passport.use(new LocalStrategy(Account.authenticate()));
passport.use(Account.createStrategy());
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());


//==================================================================
// route to test if the user is logged in or not
app.get('/loggedin', function(req, res) {
  res.json(req.isAuthenticated() ? req.user : {id:0});
});


app.post('/login', passport.authenticate('local'), function(req, res, next) {
	debug('login:');
	debug(req.user);
    res.json({state:'OK'});
});

app.post('/logout', function(req, res){
  req.logout();
  res.json({state:'OK'});
});

app.post('/register', function(req, res, next) {
  debug('registering user');
  Account.register(new Account({ username: req.body.username }), req.body.password, function(err) {
   if (err) { 
		console.log('error while user register!', err); 
		return next(err); 
	}
    debug('user registered!');
    res.json({state:'OK'});
  });
});
app.post('/upload',  uploadHandler);

//==================================================================
var apiRoot="/api";
var users = require('./routes/user')(auth);
app.use(apiRoot, users);
var projects = require('./routes/project')(auth);
app.use(apiRoot, projects);
var messages = require('./routes/message')(auth);
app.use(apiRoot, messages);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});
module.exports = server;
