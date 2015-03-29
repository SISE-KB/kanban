'use strict';

var server = require('./app'),
     config=require('./config');
     
var port=config.ServerPort;

server.listen(port, function() {
  console.log('Express server listening on port ' + port);
});

