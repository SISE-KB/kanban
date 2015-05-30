var express = require('express')
 ,mongoose = require('mongoose')
 ,debug = require('debug')('kb:route:api')

 var User=require('../models/users')
	,Project=require('../models/projects')
// require('../models/sprints')
// require('../models/tasks')
exports.addRoutes = function(app, config) {
var router = express.Router()


router
  .route('/projects/:service')
  .post(function (req, res) {
	  var sname=req.params.service
	  debug(sname)
	  debug(req.body)
      res.json([
         {name:'P1'}
      ,  {name:'P2'}
      ])
	  
  })
router
  .route('/users/:service')
  .post(function (req, res) {
	  var sname=req.params.service
	  debug(sname)
	  switch (sname)
        {
            case "uniqueMobileNo":
	   		   User.find({mobileNo:req.body.mobileNo}).then(function(data){
			     debug('uniqueMobileNo',data)
	             res.json({uniqueMobileNo: data&&data.length==0})
	           })
	           break  
	        case "load":
	   		   User.loadData({}).then(function(data){
			     debug('load',data)
	             res.json(data)
	           })
	           break     
	        default:
	            res.json({state: 'NONE'} )
	            break   
	  }
  
  })
 
  return router
}
