var async        = require('async')
  , mongoose     = require('mongoose')
  
var Message = require('../models/messages.js')
    ,User = require('../models/users.js')


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
  var ds=[
             {model:"User",	 data:{  name: 'alex',mobileNo:'139222',skills:['S1','S2'],password: '1234',
	             catalog :['老师','管理员'],isActive: true,isAdmin: true}},
             {model:"User",	 data:{  name: 'demo',mobileNo:'139666',skills:['S1','S3'],password: '1234',
	            catalog :['学生'],isActive: true,code:'2014001',sex:'M',isAdmin:false}}
            //, {model:"Project", data: { name :'p1',catalog:['Unity','2D']}}
           
  ]
  for(var i=1;i<=100;i++)
	  ds.push({model:"Message",data:{ title : 'title-'+i,text:'text'+i}})
  
  async.parallel(makeFn(ds),function(err, results){
	
		   var admin=results[0]
		   var student=results[1]
		  done()
	 
   })
} 
/*
var makeMsgsData=function(callback) {
	var data = [
	  { title : '热烈庆祝我校Ｘ获得全国游戏设计大赛一等奖',text:'热烈庆祝我校Ｘ方学获得全国游戏设计大赛一等奖' },
	  { title : '热烈欢迎广州大学某领导来我系视察工作',text:'热烈欢迎广州大学某领导来我系视察工作' }
	]
	
	async.each(data, function (item,cb) {
          .create(item,cb)
    },callback)
}*/
module.exports ={
makeData :	 makeData
}




