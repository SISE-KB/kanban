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
  .route('/project/:service')
  .post(function (req, res) {
	  var sname=req.params.service
	  debug(sname)
	  debug(req.body)
      res.json([
         {name:'P1'}
      ,  {name:'P2'}
      ])
	  
  })
 
  return router
}
