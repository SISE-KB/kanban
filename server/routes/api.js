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
	 
	  if('uniqueMobileNo'==sname){
		  User.find({mobileNo:req.body.mobileNo}).then(function(data){
			  debug(data)
	         res.json({uniqueMobileNo: data&&data.length==0})
	      })   
	  }
	  else
        res.json({state: 'NONE'} )
	  
  })
 
  return router
}
