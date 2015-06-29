'use strict';
var myenv=process.env.NODE_ENV
console.log("MY NODE_ENV:"+myenv);

var config=null;


if("production"==myenv){
	config=require('./config-production')
}
else config=require('./config-test')

var mongoose = require('mongoose')
   , server = require('./app')
   , User=require('./models/users')   
   
var port=config.listenPort

mongoose.connect(config.mongoDB, function(err) {
  if (err) {
    console.log( ' connection mongoDB error. ', err)
    throw(err)
  } else{
    console.log( 'mongoDB connected.')
    User.find({isAdmin:true},function(err,data){
	  if(data&&data.length<1) User.create({
		  isAdmin:true
		 ,name: 'admin'
		 ,code:'114'
		 ,password:'114'
	  }) 
	})
  }
})

server.listen(port, function() {
  console.log('Express server listening on port ' + port)
    var open = require('open');
    open(config.url+':' + config.listenPort + '/');
})

