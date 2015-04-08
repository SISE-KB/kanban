'use strict';

var mongoose = require('mongoose')
   , server = require('./src/app')
   ,  config=require('./config')
     
var port=config[config.env].ServerPort

mongoose.connect(config[config.env].MongoDbURL, function(err) {
  if (err) {
    console.log(config[config.env]. MongoDbURL+ ' connection error. ', err);
    throw(err)
  } else{
    console.log(config[config.env]. MongoDbURL + ' connected.')
  }
})

server.listen(port, function() {
  console.log('Express server listening on port ' + port)
})

