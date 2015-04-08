var expect = require('expect.js')
   ,tool    = require("../db/util")
   ,async = require('async')
  , mongoose     = require('mongoose')
   
require('../src/models/User')

var User = mongoose.model('User')

describe('Users Test', function () {
      before(function(){
		  tool.connectDB() 
	  })
      after(function(){
		  tool.closeDB()
	  })
	 it('User.loadData', function (done) {
         User.loadData({name:'alex'})
         .then(function(data){
             expect(data).to.be.an('array')
			 expect(data).to.have.length(1)

             expect(data[0].name).to.be('alex')
             expect(data[0].isActive).to.equal(true)
             var prjs=data[0].projects;
             //prjs.should.be.an.Array
             expect(prjs).to.be.an('array')
             expect(prjs).to.have.length(1)
        
             expect(prjs[0].name).to.be('p1')
             done()
          })
    })
   it('promise test', function (done) {
       var prom = User.find().exec()
       prom.then(function (people) {
          var ids = people.map(function (p) {
             return p._id
           })
           expect(ids).to.have.length(2)
           return User.find({ _id : { $in : ids }}).exec()
       }).then(function (data) {
		   expect(data).to.be.an('array')
           expect(data).to.have.length(2)
           done()
      })
  })
})
