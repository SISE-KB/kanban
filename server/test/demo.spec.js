'use strict';
var expect = require('expect.js')

  

function add (a, b) { return a + b; };
describe('demo test suite', function () {
       it('should expose a function', function () {
         expect(add).to.be.a('function');
       })
       it('should do math OK', function () {
            expect(add(1, 3)).to.equal(4);
        })

})
