var express = require('express')
 ,mongoose = require('mongoose')

exports.addRoutes = function(app, config) {
var router = express.Router()

router
  .route('/projects/:service')
  .post(function (req, res) {
     //console.log( '/projects/:service')
	 var api=require('../api-exec/api-projects')
     api.exec(req, res) 
	  
	  
  })
router
  .route('/users/:service')
  .post(function (req, res) {
	 var api=require('../api-exec/api-users')
     api.exec(req, res)
  })
 
  return router
}
