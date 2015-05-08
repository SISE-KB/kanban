'use strict';

var mongoose = require('mongoose'),
     Schema = mongoose.Schema,
     ObjectId = Schema.ObjectId;


var MySchema = new Schema({
	 name: String
	,spec: String
	,type: String
	,targetType: String
	,target: String	
	,priority: Number
	,projectId: ObjectId
	,backlogId: ObjectId
	,state  :  {type: String,default: 'TODO'}
	,assignedUserId: ObjectId
	,regDate:Date
	,closeDate:Date	
});

exports=module.exports = mongoose.model('Issue', MySchema);
