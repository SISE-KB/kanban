var debug = require('debug')('kb:api:userS')

 var User=require('../models/users')
//	,Project=require('../models/projects')

exports.exec = function(req, res) {
   var sname=req.params.service
   debug(" API--"+sname )
   switch (sname){
            case "uniqueMobileNo":
              //req.params.query
	   		   User.find({mobileNo:req.body.mobileNo}).then(function(data){
			     debug('uniqueMobileNo',data)
	             res.json({uniqueMobileNo: data&&data.length==0})
	           })
	           break  
	        case "load":
	   		   User.find({isActive:true}).select('name mobileNo').then(function(data){
			     debug('load',data)
	             res.json(data)
	           })
	           break     
	        default:
	            res.json({state: 'NONE'} )
	            break   
	  }
}
