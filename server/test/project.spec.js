var expect = require('expect.js')
   ,tool    = require("../db/util")
  , mongoose     = require('mongoose')
   
var Project = mongoose.model('Project')

describe('Projects Test', function () {
      before(function(){
		  tool.connectDB() 
	  })
      after(function(){
		  tool.closeDB()
	  })
  
    it('Project.loadData', function (done) {
         var prom = Project.loadData({name:'p1'})
         prom.then(function(data){
			 expect(data.length).to.be(1)
			 var members=data[0].members;
             expect(members).to.be.an('array')
             expect(members.length).to.be(1)
             done()
             
        })
    })
   
})
