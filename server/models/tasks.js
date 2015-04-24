'use strict';

var mongoose = require('mongoose'),
     Schema = mongoose.Schema,
     ObjectId = Schema.ObjectId;


var TaskSchema = new Schema({
 /* title: String,

  planEffort : Number,
  start : Date ,
  deadline : Date,
  state : String,
  owner : [{type: ObjectId, ref: 'User'} ],
  spec : String,
  examiner : [{type: ObjectId, ref: 'User'} ],
  offset : Number,
  finishDate  : Date*/
	 name: String
	,projectId: ObjectId
	,backlogId: ObjectId
	,sprintId: ObjectId
	,estimation : Number
	,remaining  : Number
	,deadline: Date
	,state  :  {type: String,default: 'TODO'}
	,assignedUserId: ObjectId
	,spec: String
	,offset:Number
	,finishDate:Date
});

exports=module.exports = mongoose.model('Task', TaskSchema);
