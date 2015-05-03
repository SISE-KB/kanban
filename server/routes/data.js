var express = require('express')
 ,mongoose = require('mongoose')
 ,debug = require('debug')('kb:route:data')
 /*
 require('../models/users')
 require('../models/projects')
 require('../models/messages')
 require('../models/productbacklogs')
 require('../models/sprints')
 require('../models/tasks')*/
 
exports.addRoutes = function(app, config) {
var dbRouter = express.Router()

function likeHandle(obj)
{
 
   for(var p in obj){
     obj[p]=new RegExp(obj[p])
   }
  // console.log(obj) 
   return obj	 
}


dbRouter
  .route('/:collection/:id?')
  .get(function (req, res) {
	  var id=req.params.id
	  var cname=req.params.collection
	  
	  var m=require('../models/'+cname)
       ,strict=req.query.strict
       ,search=JSON.parse(req.query.q||'{}')
      debug(cname)
	  if(!strict)
		  search=likeHandle(search)
	 // search=IdHandle(search)
      if(!!id)  m.findById(id,function(err,data){
		  if(err) return next(err);
		  debug(data)
		  res.json(data)
	  })
	  else{
		  debug('search-->',search)
		  m.find(search,function(err,data){
		    if(err) return next(err);
		    debug(data)
	        res.json(data)
	      })
	  }      
  })
  .put(function (req, res) {
	  var id=req.params.id
	  var cname=req.params.collection
	  var m=require('../models/'+cname)
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
	  var m=require('../models/'+cname)
	 // debug(req.body)
      m.create(req.body, function (err, post) {
		
		if (err) {
			debug(err) 
			return next(err);
		}
	//	debug(post)  
		res.json(post)
	  })
  })
  .delete(function (req, res) {
	  var id=req.params.id
	  var cname=req.params.collection
	  var m=require('../models/'+cname)
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
