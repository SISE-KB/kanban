'use strict';
var expect = require('expect.js')
   ,tool    = require("../db/util")
  
var Message = require('../src/models/Message');

describe('Message Test', function () {
      before(function(){
		  tool.connectDB() 
	  })
      after(function(){
		  tool.closeDB()
	  })

      it('find All Messages', function (done) {
		   Message.find({}, function (err, data) {
			  // data.should.be.an.Array
			   expect(data).to.be.an('array')
			   expect(data).to.have.length(2)
			   done()
		   });
	   })
	   it('find One Message', function (done) {
		   Message.findOne({}, function (err, doc) {
			   expect(doc.title).to.contain('一等奖')
			  // doc.title.should.startWith('热烈庆祝我校Ｘ获得全国游戏设计大赛一等奖');
			   done()
		   });
	   })
	
})

