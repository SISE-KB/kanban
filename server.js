'use strict';

var server = require('./app');
     
var port=process.env.PORT || 3000;
//server.set('port', port);

server.listen(port, function() {
  console.log('Express server listening on port ' + port);
});

//http://adrianmejia.com/blog/2014/10/01/creating-a-restful-api-tutorial-with-nodejs-and-mongodb/
