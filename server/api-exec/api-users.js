var debug = require('debug')('kb:api:user')

 var User=require('../models/users')
//	,Project=require('../models/projects')

exports.exec = function(req, res) {
   var sname=req.params.service
   debug(" API--"+sname )
   switch (sname){
            case "uniqueMobileNo":
	   		   User.find({mobileNo:req.body.mobileNo}).then(function(data){
			     debug('uniqueMobileNo',data)
	             res.json({uniqueMobileNo: data&&data.length==0})
	           })
	           break  
	        case "load":
	   		   User.find(req.params.query).select('name mobileNo').then(function(data){
			     debug('load',data)
	             res.json(data)
	           })
	           break     
	        default:
	            res.json({state: 'NONE'} )
	            break   
	  }
}
