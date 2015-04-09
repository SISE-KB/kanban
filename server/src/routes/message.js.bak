'use strict';

var express = require('express');
var router = express.Router();
var Message = require('../models/Message');
var debug = require('debug')('kb:services:message');
 
exports = module.exports = function(auth){
	var pre='/messages';
	/* GET /projects listing. */
	router.get(pre+'/', function(req, res, next) {
	 Message.find().limit(10).sort('-recDate').exec(function (err, data) {// order by recDate
		if (err) return next(err);
		res.json(data);
		debug(data);
	  });
	});

	/* POST /projects */
	router.post(pre+'/', auth,function(req, res, next) {
	  Message.create(req.body, function (err, post) {
		if (err) return next(err);
		debug(post);
		res.json(post);
	  });
	});

	/* GET /projects/id */
	router.get(pre+'/:id', auth,function(req, res, next) {
	  Message.findById(req.params.id, function (err, post) {
		if (err) return next(err);
		res.json(post);
	  });
	});

	/* PUT /projects/:id */
	router.put(pre+'/:id', auth,function(req, res, next) {
	  Message.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
		if (err) return next(err);
		res.json(post);
	  });
	});

	/* DELETE /projects/:id */
	router.delete(pre+'/:id',auth, function(req, res, next) {
	  Message.findByIdAndRemove(req.params.id, req.body, function (err, post) {
		if (err) return next(err);
		res.json(post);
	  });
	});
	return router;
};
