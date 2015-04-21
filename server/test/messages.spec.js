'use strict';
var expect = require('expect.js')
   ,tool    = require("../db/util")
  
var Message = require('../models/messages');

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
			   expect(data).to.have.length(100)
			   done()
		   });
	   })
	   it('find One Message', function (done) {
		   Message.findOne({}, function (err, doc) {
			   expect(doc.title).to.contain('1')
			   done()
		   });
	   })
	
})

