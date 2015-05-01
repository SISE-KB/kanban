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

function string2Object(str)
{
   var obj = JSON.parse(str)
   
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
	  ,search=req.query.q
	  console.log(search) 	  
	  if(!!search)
		  search=string2Object(search)
	  else search={}
	  
  
      if(!!id)  m.findById(id,function(err,data){
		  if(err) return next(err);
		  console.log(data)
		  res.json(data)
	  })
	  else m.find(search,function(err,data){//req.query.q
		  if(err) return next(err);
		  console.log(search)
		  console.log(data.length)
	      res.json(data)
	   })  
  })
  .put(function (req, res) {
	  var id=req.params.id
	  var cname=req.params.collection
	  var m=require('../models/'+cname)
      if(!!id)   m.findByIdAndUpdate(id, req.body, function (err, post) {
		if (err) return next(err);
		console.log(req.body)
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
		debug(post)  
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
