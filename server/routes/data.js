var express = require('express')
 ,debug = require('debug')('kb:route:data')
exports.addRoutes = function(app, config) {
var dbRouter = express.Router()
dbRouter
  .route('/:collection/:id?')
  .get(function (req, res) {
	  var id=req.params.id
	  var cname=req.params.collection
	  console.log('query: ',req.query)
	  m=require('../models/'+cname)
	  
      if(!!id)  m.findById(id,function(err,data){
		  res.json(data)
	  })
	  else m.find(req.query.q,function(err,data){
	     res.json(data)
	   })  
  })
  .put(function (req, res) {
	  var id=req.params.id
	  var cname=req.params.collection
	  m=require('../models/'+cname)
      if(!!id)   m.findByIdAndUpdate(id, req.body, function (err, post) {
		if (err) return next(err);
		res.json(post);
	  })
		else {
			res.json({err:'not id'})
	  }
  })
  .post(function (req, res) {
	  var cname=req.params.collection
	  m=require('../models/'+cname)
      m.create(req.body, function (err, post) {
		if (err) return next(err);
		debug(post)
		res.json(post)
	  })
  })
  .delete(function (req, res) {
	  var id=req.params.id
	  var cname=req.params.collection
	  m=require('../models/'+cname)
       if(!!id)  m.findByIdAndRemove(req.params.id, req.body, function (err, post) {
		if (err) return next(err);
		res.json(post);
	  })
	  else {
		res.json({err:'not id'})
	  }
 })	  
  return dbRouter;
}
