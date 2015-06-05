var express = require('express')
	,mongoose = require('mongoose')

exports.addRoutes = function(app, config) {
	var router = express.Router()
	var ress=[ 'projects'
				,'users'
				,'backlogs'
	           ]
	ress.forEach(function(item){  
		router.route('/'+item+'/:service')
		.post(function (req, res) {
			var api=require('../api-exec/api-'+item)
			api.exec(req, res) 
		})
	})
  return router
}
