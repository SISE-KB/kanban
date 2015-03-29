'use strict';

var express = require('express');
var router = express.Router();
var Project = require('../models/Project');
var debug = require('debug')('kb:services:project');
 
exports = module.exports = function(auth){
	var pre='/projects';
	/* GET /projects listing. */
	router.get(pre+'/', auth,function(req, res, next) {
	  Project.find().populate('members').exec(function (err, prjs) {
		if (err) return next(err);
		res.json(prjs);
		debug(prjs);
	  });
	});

	/* POST /projects */
	router.post(pre+'/', auth,function(req, res, next) {
	  Project.create(req.body, function (err, post) {
		if (err) return next(err);
		res.json(post);
	  });
	});

	/* GET /projects/id */
	router.get(pre+'/:id', auth,function(req, res, next) {
	  Project.findById(req.params.id, function (err, post) {
		if (err) return next(err);
		res.json(post);
	  });
	});

	/* PUT /projects/:id */
	router.put(pre+'/:id', auth,function(req, res, next) {
	  Project.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
		if (err) return next(err);
		res.json(post);
	  });
	});

	/* DELETE /projects/:id */
	router.delete(pre+'/:id',auth, function(req, res, next) {
	  Project.findByIdAndRemove(req.params.id, req.body, function (err, post) {
		if (err) return next(err);
		res.json(post);
	  });
	});
	return router;
};
