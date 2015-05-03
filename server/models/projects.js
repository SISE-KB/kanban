'use strict';

var mongoose = require('mongoose'),
     Schema = mongoose.Schema,
     ObjectId = Schema.ObjectId;
//var User = require('./users');   

  
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
	 name : String
	,catalog : String
	,tags : String
	,productOwner: ObjectId
	,procMaster: ObjectId
	,teamMembers: [ObjectId]
	,isSample : {type: Boolean,default: false}
	,planDate : Date
	,iterationDuration :  {type: Number,default: 4}
	,state  :  {type: String,default: 'TODO'}
	,finishDate : Date
	,desc : String

});



 /*
  * ProjectSchema.statics.loadData = function (query) {
  return this.find(query)
   .populate('manager','name')
   .populate('members.user','name')
   .exec();
 };
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
