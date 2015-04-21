var expect = require('expect.js')
  , superagent = require('superagent')
  ,tool    = require("../db/util")
 
describe ('Baidu', function() {
   it("should return the baidu homepage", function(done) {
      superagent.get('http://www.baidu.com/')
         .end(function(e, res) {
            expect(e).to.be(null)
            expect(res.status).to.be(200)
            done();
         })
   })
})
/*
describe ('Route', function() {
	 before(function(){
		  //tool.connectDB() 
		   require("../server")
	  })
	   after(function(){
		 // tool.closeDB()
	  })
   it("should  to fetch projects list", function(done) {
      superagent.get('http://localhost:3000/api/users')
         .end(function(e, res) {
          //  expect(e).to.be(null)
           // expect(res.status).to.be(401)
           console.log(e);
            done();
         })
   })
})
*/
