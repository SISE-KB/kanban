'use strict';

var mongoose = require('mongoose'),
     Schema = mongoose.Schema,
     ObjectId = Schema.ObjectId;


var TaskSchema = new Schema({

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
