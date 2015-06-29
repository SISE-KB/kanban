var debug = require('debug')('kb:api:projects')
    ,async        = require('async')
   , Project=require('../models/projects')
	,Backlog=require('../models/backlogs')
	,User=require('../models/users')
	,Task=require('../models/tasks')
	,Issue=require('../models/issues')
	
var loadUser=function (prj){
	return function(callback){
	     User.findById(prj.productOwnerId).select('name image code')
	     .then(function(doc){
			 //debug('load productOwnerId--',doc);
		     callback(null,doc||{});
		 })   
	 }
}
var loadTasks=function (prj){
	return function(callback){
	     Task.find({projectId:prj._id}).select('name estimation')
	     .then(function(doc){
			// debug('load tasks',doc);
		     callback(null,doc);
		 })   
	 }
}
var loadIssues=function (prj){
	return function(callback){
	     Issue.find({projectId:prj._id}).select('name estimation')
	     .then(function(doc){
			// debug('load issues',doc);
		     callback(null,doc);
		 })   
	 }
}
var loadBacklogs=function (prj){
	return function(callback){
	     Backlog.find({projectId:prj._id}).select('name estimation state')
	     .then(function(data){
			var rt={}
			    ,field='state'; 
			data.forEach(function(d){
					rt[ d[field] ]=rt[ d[field] ] || []
					rt[ d[field] ].push(d)
			});
			//debug('load backlogs',rt);
			rt.TODO=rt.TODO||[];
			rt.DOING=rt.DOING||[];
			rt.DONE=rt.DONE||[];
			rt.OK=rt.OK||[];
		    callback(null,rt);
		 })   
	 }
}

var makeFn=function(prjs){
	var fns=[]
	for(idx in prjs){
	  fns.push(loadUser(prjs[idx])) ;
	  fns.push(loadTasks(prjs[idx])) ;
	  fns.push(loadIssues(prjs[idx])) ;
	  fns.push(loadBacklogs(prjs[idx])) ;
    }
	return fns;	  
}	

exports.exec = function(req, res) {
   var sname=req.params.service
   debug("projects API--"+sname )
   switch (sname){
            case "devby":
			   debug('devby',req.body.userId) //todo: state should not close
	   		   Project.where('teamMembers').in([req.body.userId])
			   .select('name state').then(function(data){
	              debug('devby',data)
				  res.json(data)
	           })
	           break  
			case "mgrby":
			  //  debug('mgrby',req.body.userId)
	   		    Project.find({productOwnerId:req.body.userId})
				.select('name state').then(function(data){
				  debug('mgrby',data)
	              res.json(data)
	           })
	           break  
	       case "load":
	   		   Project.find(req.params.query).select('name productOwnerId state' ).then(function(data){
			     debug('load',data)
	             res.json(data)
	           })
	           break  
	       case "stats":
				Project.find().select('name productOwnerId').then(function(data){
					if(data.length<1){
						res.json([])
					}else{
					  async.parallel(makeFn(data),function(err, results){
						var rt=[]
						var doc
						for(idx in results){
							n=Math.floor(idx/4)
						   if(idx%4==0) {
							   doc={_id:data[n]._id,name:data[n].name}
							   if(!!results[idx].code&&!!results[idx].image)
							     doc.mgrImage=results[idx].code+'/'+results[idx].image
						       rt.push(doc)
						  }
						   else if(idx%4==1) 
							   doc.tasks=results[idx]
						   else if(idx%4==2) 
						     doc.issues=results[idx]   
						   else 
						     doc.backlogs=results[idx]  
						 //  debug(n,doc);  
						}
						 debug(rt)
						 res.json(rt)
						
				    	})
				   } 	
				})
				break    
	        default:
	            res.json({state: 'NONE'} )
	            break   
	  }
}
