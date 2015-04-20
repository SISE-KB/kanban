var path = require('path');

module.exports = {
  mongo: {
	MongoDB: 'mongodb://localhost/test',          
    dbUrl: 'http://localhost/databases/ascrum/collections/',            // The base url of the MongoLab DB server
    apiKey: '4fb51e55e4b02e56a67b0b66'                 // Our MongoLab API key
  },
  security: {
    dbName: 'ascrum',                                   // The name of database that contains the security information
    usersCollection: 'users'                            // The name of the collection contains user information
  },
  server: {
    listenPort: 3000,                                   // The port on which the server is to listen (means that the app is at http://localhost:3000 for instance)
    securePort: 8433,                                   // The HTTPS port on which the server is to listen (means that the app is at https://localhost:8433 for instance)
    distFolder: path.join(__dirname, '../client/dist'),  // path.resolve(__dirname,"../../client/dist")
    staticUrl: '/static',                               // The base url from which we serve static files (such as js, css and images)
    cookieSecret: 'angular-app'                         // The secret for encrypting the cookie
  }
};
