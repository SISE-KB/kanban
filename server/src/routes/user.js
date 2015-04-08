'use strict';

var express = require('express'),
    router = express.Router(),
    User = require('../models/User'),
    debug = require('debug')('kb:services:user');
    
exports = module.exports = function(auth){
	var pre='/users';

	
	/* GET /users listing. */
	router.get(pre+'/', auth,function(req, res, next) {
	  User.find().select('-salt -hash -__v').exec(function (err, users) {
		if (err) return next(err);
		debug(users);
		res.json(users);
	  });
	});

	/* POST /users */
	router.post(pre+'/', auth,function(req, res, next) {
	  User.create(req.body, function (err, post) {
		if (err) return next(err);
		res.json(post);
	  });
	});

	/* GET /users/id */
	router.get(pre+'/:id', auth,function(req, res, next) {
	  User.findById(req.params.id, function (err, post) {
		if (err) return next(err);
		res.json(post);
	  });
	});

	/* PUT /users/:id */
	router.put(pre+'/:id',auth, function(req, res, next) {
	  User.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
		if (err) return next(err);
		res.json(post);
	  });
	});

	/* DELETE /users/:id */
	router.delete(pre+'/:id', auth,function(req, res, next) {
	  User.findByIdAndRemove(req.params.id, req.body, function (err, post) {
		if (err) return next(err);
		res.json(post);
	  });
	});
	return router;
};

