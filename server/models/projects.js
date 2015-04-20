'use strict';

var mongoose = require('mongoose'),
     Schema = mongoose.Schema,
     ObjectId = Schema.ObjectId;
var User = require('./users');   

  
var RoleSchema = new Schema({
	  _id:Number,
	  role : String,
	  user : {type: ObjectId, ref: 'User'} 
});
/*
var DeliverableSchema = new Schema({
	  _id:Number,
	  code : String,
	  title : String,
	  spec : String,
	  state : String
});
var StageSchema = new Schema({
	  _id:Number,
	  code : String,
	  planEffort : Number,
	  effort : Number,
	  start : Date,
	  end : Date,
	  closedDate : Date,
	  deliverCodes : [String],
	  tasks : [{type: ObjectId, ref: 'Task'} ]
});
*/

var ProjectSchema = new Schema({
  name : String,
  catalog : [String],
  tags : [String],
  
 // manager : {type: ObjectId, ref: 'User'} ,
  isSample : {type: Boolean,default: false},
  planDate : Date,
  iterationDuration :  {type: Number,default: 2},
  state  :  {type: Number,default: 1},
  finishDate : Date,
  desc : String,
//  deliverables :[DeliverableSchema],
//  stages  : [StageSchema],
  productOwner: ObjectId,
  scrumMaster: ObjectId,
  teamMembers: [ObjectId]
  //members   : [RoleSchema]
});

ProjectSchema.methods.SetManager = function (userId,cb) {
   this.manager=userId;
   var self=this
   User.JoinProject(userId,self._id,function(){
	   // console.log("SetManager");
       self.save(cb);
	});	   
 };

ProjectSchema.methods.AddMember = function (role,cb) {
  // console.log(this);
   this.members.push(role);
   var self=this
   User.JoinProject(role.user,self._id,function(){
	  // console.log("AddMember");
       self.save(cb);	
	});	     
};

ProjectSchema.methods.RemoveMember = function (role,cb) {
   var arr=this.members;
   for (var i=0; i<arr.length; i++){ 
      if ( arr[i].user == val.user){ 
           for (var j=i; j<arr.length; j++) { 
                arr[j] = arr[j+1]; 
            }
            arr.pop(); 
       } 
   } 
   this.save(cb);
};

ProjectSchema.statics.loadData = function (query) {
  return this.find(query)
   .populate('manager','name')
   .populate('members.user','name')
   .exec();
 };
 /*
 ProjectSchema.plugin(deepPopulate,{
    populate: {
		manager  : {
           select : 'name -__v'
	    },
        members  : {
           select : 'role user'
       },
       'members.user': {
           select: 'name  -__v'
        }
    }
 });*/
 
module.exports = mongoose.model('Project', ProjectSchema);
