var path = require('path');

module.exports = {
    mongoDB: 'mongodb://localhost/test',
    url: 'http://127.0.0.1', 
    listenPort: 3000,                                   // The port on which the server is to listen (means that the app is at http://localhost:3000 for instance)
    securePort: 8433,                                   // The HTTPS port on which the server is to listen (means that the app is at https://localhost:8433 for instance)
    distFolder: path.join(__dirname, '../client/dist'),  // path.resolve(__dirname,"../../client/dist")
    cookieSecret: 'kanban-app'                         // The secret for encrypting the cookie
};
