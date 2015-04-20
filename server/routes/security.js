exports.addRoutes = function(app, security) {

app.get('/loggedin', function(req, res,next) {
		res.json(req.isAuthenticated() ? req.user : {id:0})
})

app.post('/register', security.register)


app.post('/login',  security.login);
app.post('/logout', security.logout);

app.get('/current-user', security.sendCurrentUser);

// Retrieve the current user only if they are authenticated
app.get('/authenticated-user', function(req, res) {
  security.authenticationRequired(req, res, function() { security.sendCurrentUser(req, res); });
});

// Retrieve the current user only if they are admin
app.get('/admin-user', function(req, res) {
  security.adminRequired(req, res, function() { security.sendCurrentUser(req, res); });
});

};
