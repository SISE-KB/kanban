var debug = require('debug')('kb:api:backlogs')
	,Backlog=require('../models/backlogs')

exports.exec = function(req, res) {
	var sname=req.params.service
	debug("backlogs API--"+sname )
	switch (sname){
		case "stats":
			var field=req.body.field||'state'
			debug("stats by "+field )
			Backlog.find({projectId:req.body.projectId}).then(function(data){
				var rt={}
				data.forEach(function(d){
					rt[ d[field] ]=rt[ d[field] ] || []
					rt[ d[field] ].push(d)
				})
				res.json(rt)
				debug(data)
			})
			break  
		case "update":
			var id=req.body.id||req.body._id
			//var state=req.body.state
			delete req.body._id;
			delete req.body.id;
			debug(id,req.body)
			Backlog.findByIdAndUpdate(id,req.body).then(function(oldData){
				//debug(oldData);
			    res.json({state:'OK'})
		    });
		 	break  
		default:
			res.json({state:'OK'})
	        break   
	}
}
