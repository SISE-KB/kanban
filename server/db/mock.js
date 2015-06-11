var async        = require('async')
  , mongoose     = require('mongoose')
  
require('../models/messages.js')
require('../models/users.js')
require('../models/projects.js')

function getFn(rec){
	return function(callback){
	     mongoose.models[rec.model].create(rec.data,function(err,doc){
		    callback(null,doc)
		 })   
	 }
}
var makeFn=function(ds){
	var fns=[]
	for(idx in ds){
	  fns.push(getFn(ds[idx]))
	} 	  
	return fns	  
}	
var makeData=function(done) {
  var admin= {model:"User",	 data:{  name: '管理员',code:'114',password: '114',mobileNo:'114',
	             type :'T',isActive: true,isAdmin: true}}
  var dev={model:"User",	 data:{  name: 'demo',code:'test',password: '1234',mobileNo:'139666',
	            type :'S',isActive: true,code:'2014001',isAdmin:false}}
  var prj={model:"Project",	 data:{  name: '神庙逃亡',catalog:'Unity 2D',tags: 'Run'}}            	             	
  var ds=[ admin ,dev ,prj]
  for(var i=1;i<=100;i++)
	  ds.push({model:"Message",data:{ title : 'title-'+i,text:'text'+i}})
  
  async.parallel(makeFn(ds),function(err, results){
	
		   var admin=results[0]
		   , dev=results[1]
		   , prj=results[2]
		   prj.productOwnerId=admin._id
		   prj.devMasterId=dev._id
		   prj.teamMembers.push(dev._id)
		   prj.save(function(err,prj){
		      done()
		      console.log(prj)
		   })   
	 
   })
} 

module.exports ={
makeData :	 makeData
}




