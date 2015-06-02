var debug = require('debug')('kb:api:project')

 var Project=require('../models/projects')

exports.exec = function(req, res) {
   var sname=req.params.service
   debug("projects API--"+sname )
   switch (sname){
            case "devby":
			   debug('devby',req.body.userId)
	   		   Project.where('teamMembers').in([req.body.userId])
			   .select('name state').then(function(data){
	              debug(data)
				  res.json(data)
	             //res.json([{name:'P1'}])
	           })
	           break  
			case "mgrby":
			    debug('mgrby',req.body.userId)
	   		    Project.find({productOwner:req.body.userId})
				.select('name state').then(function(data){
				  debug(data)
	              res.json(data)
	           })
	           break  
	        case "load":
	   		   Project.find(req.params.query).select('name').then(function(data){
			     debug('load',data)
	             res.json(data)
	           })
	           break     
	        default:
	            res.json({state: 'NONE'} )
	            break   
	  }
}
