'use strict';

var mongoose = require('mongoose'),
     Schema = mongoose.Schema,
     ObjectId = Schema.ObjectId;
     
//var UserSchema = require('../user/schema.js');

var ProjectSchema = new Schema({
  name: String,
  members   : [{type: ObjectId, ref: 'User'} ]
});
ProjectSchema.methods.AddMember = function (user) {
   this.members.push(user);
   //user.projects.push(this);
   //user.save();
   this.save();
}
ProjectSchema.methods.RemoveMember = function (user) {
   var arr=this.members;
   for (var i=0; i<arr.length; i++){ 
      if ( arr[i] == val){ 
           for (var j=i; j<arr.length; j++) { 
                arr[j] = arr[j+1]; 
            }
            arr.pop(); 
       } 
   } 
   this.save();
}

module.exports = mongoose.model('Project', ProjectSchema);
