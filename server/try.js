'use strict';

function Cat(name){
  this.name=name;
}


var c1=new Cat("cat1");
var c2=c1;
console.log(c1==c2);
c1=undefined;
console.log(c1,c2);
