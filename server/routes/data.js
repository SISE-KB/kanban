var express = require('express')
 ,mongoose = require('mongoose')
 ,debug = require('debug')('kb:route:data')

 
exports.addRoutes = function(app, config) {
var dbRouter = express.Router()

function likeHandle(obj)
{

    for(var p in obj){
       obj[p]=new RegExp(obj[p])
      }
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
      debug(cname,search)
	  if(!strict)
		  search=likeHandle(search)
      if(!!id)  m.findById(id,function(err,data){
		  if(err) return next(err);
		  debug(data)
		  res.json(data)
	  })
	  else{
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
	  if(!!id) {
        
		/* var item=new m(req.body);
		 if(cname==="users"&&item.password&&item.password.length < 20){
		    item.setPassword(req.body.password,function(err,user){
			    req.body.password=user.password;
			    console.log(req.body);
			    m.findByIdAndUpdate(id, req.body);
			});
		 }else{
  		   m.findByIdAndUpdate(id, req.body);
         }
		 res.json(req.body); 		 
	  }*/
	    var q=m.findById(id).lean(false);
		q.exec(function(err,doc){
		     //
			  if(err) throw err;
			   //debug("update:",req.body)
			  
			  for( var p in req.body)
				  doc[p]=req.body[p];
			  	  
	          //console.log(doc);
			  doc.save();
			  res.json(req.body);
			
          });
		  
	  }else {
		res.json({err:'invalid id'})
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
