var debug = require('debug')('kb:api:userS')

 var User=require('../models/users')
	   ,Task=require('../models/tasks')

exports.exec = function(req, res) {
   var sname=req.params.service
   debug(" API--"+sname )
   switch (sname){
            case "uniqueCode":
              //req.params.query
	   		   User.find({code:req.body.code}).then(function(data){
			     debug('uniqueCode',data.length)
	             res.json({uniqueCode: data&&data.length==0})
	           })
	           break  
	        case "load":
	   		   User.find({isActive:true}).select('code name mobileNo').then(function(data){
			     debug('load',data)
	             res.json(data)
	           })
	           break    
	       case "loadTasks":
	   		   Task.find({assignedUserId:req.body.userId}).then(function(data){
			     debug('loadTasks',data)
	             res.json(data)
	           })
	           break    
	        default:
	            res.json({state: 'NONE'} )
	            break   
	  }
}
