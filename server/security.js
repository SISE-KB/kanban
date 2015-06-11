var passport = require('passport')
   ,LocalStrategy = require('passport-local').Strategy
   ,Account = require('./models/users')
   ,Project = require('./models/projects')
var filterUser = function(user) {
  if ( !!user ) {
    return {
      user : {
        id: user._id,
		code:user.code,
        mobileNo: user.mobileNo,
        name: user.name,
        isAdmin: user.isAdmin
      }
    };
  } else {
    return { user: null };
  }
};

var security = {
  initialize: function(app) {
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(Account.createStrategy());
    passport.serializeUser(Account.serializeUser());
    passport.deserializeUser(Account.deserializeUser());
  },
  authenticationRequired: function(req, res, next) {
    console.log('authRequired');
    if (req.isAuthenticated()) {
      next();
    } else {
      res.json(401, filterUser(req.user));
    }
  },
  adminRequired: function(req, res, next) {
    console.log('adminRequired');
    if (req.user && req.user.isAdmin ) {
      next();
    } else {
      res.json(401, filterUser(req.user));
    }
  },
  register: function(req, res, next) {
    Account.register(new Account({ code: req.body.code,
	  name: req.body.name
	  }), req.body.password, function(err) {
      if (err) { 
		console.log('error while user register!', err); 
		return next(err); 
	  }
      res.json({state:'OK'});
    })
  },
  sendCurrentUser: function(req, res, next) {
      var data=filterUser(req.user);
	  res.json(data);
  },
  login: function(req, res, next) {
    function authenticationFailed(err, user, info){
      if (err) { return next(err); }
      if (!user) { return res.json(filterUser(user)); }
      req.login(user, function(err) {
        if ( err ) { return next(err); }
        return res.json(filterUser(user));
      });
    }
   //  res.json(filterUser({name:'alex',isAdmin:true,_id:1234}));
    return passport.authenticate('local', authenticationFailed)(req, res, next);
  },
  logout: function(req, res, next) {
    req.logout();
    res.sendStatus(204);
  }
};

exports=module.exports = security;
