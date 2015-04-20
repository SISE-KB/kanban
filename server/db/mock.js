var async        = require('async')
  , mongoose     = require('mongoose')
  
var Message = require('../src/models/Message.js')
    ,User = require('../src/models/User.js')
    ,Project = require('../src/models/Project.js')

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
             {model:"User",	 data:{  name: 'alex',mobileNo:'139',skills:['S1','S2'],password: '1234',
	             catalog :['老师','管理员'],isActive: true}},
             {model:"User",	 data:{  name: 'demo',mobileNo:'139',skills:['S1','S3'],password: '1234',
	            catalog :['学生'],isActive: true,code:'2014001',sex:'M'}},
             {model:"Project", data: { name :'p1',catalog:['Unity','2D']}},
             {model:"Project", data: { name :'p2',catalog:['cocos2d-x','C++']}}
  ]
  
  async.parallel(makeFn(ds),function(err, results){
	  makeMsgsData(function(){
		   var admin=results[0]
		   var student=results[1]
		   var prj=results[2]
		   prj.AddMember({ user : student._id,role:'2D'},function(){
		      prj.SetManager(admin._id,function(){
		         done()
		      })
		   })   
	  })
   })
} 
 
var makeMsgsData=function(callback) {
	var data = [
	  { title : '热烈庆祝我校Ｘ获得全国游戏设计大赛一等奖',text:'热烈庆祝我校Ｘ方学获得全国游戏设计大赛一等奖' },
	  { title : '热烈欢迎广州大学某领导来我系视察工作',text:'热烈欢迎广州大学某领导来我系视察工作' }
	]
	async.each(data, function (item,cb) {
          Message.create(item,cb)
    },callback)
}
module.exports ={
makeData :	 makeData
}


