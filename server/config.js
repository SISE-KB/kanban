'use strict';


var config= {
env:"development",
development:{	
	MongoDbURL : 'mongodb://localhost/test',
	ServerPort : 3000
},	
release:{	
	MongoDbURL : 'mongodb://localhost/kanban_db',
	ServerPort : 8080
}	
};


exports=module.exports =config;
