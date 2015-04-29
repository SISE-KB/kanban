'use strict';

var mongoose = require('mongoose')
   , server = require('./app')
   , config=require('./config')
   , User=require('./models/users')   
var port=config.server.listenPort

mongoose.connect(config.mongo.MongoDB, function(err) {
  if (err) {
    console.log(config.mongo.MongoDB+ ' connection error. ', err)
    throw(err)
  } else{
    console.log(config.mongo.MongoDB + ' connected.')
    User.find({isAdmin:true},function(err,data){
	  if(data&&data.length<1) User.create({
		  isAdmin:true
		 ,name: 'admin'
		 ,mobileNo:'114'
		 ,password:'114'
	  }) 
	})
  }
})

server.listen(port, function() {
  console.log('Express server listening on port ' + port)
    var open = require('open');
    open(config.server.url+':' + config.server.listenPort + '/');
})

