'use strict';

var mongoose = require('mongoose'),
     Schema = mongoose.Schema,
     ObjectId = Schema.ObjectId;


var MyEventSchema = new Schema({
	 title: String
	,projectId: ObjectId
	,userId: ObjectId
	,taskId: ObjectId
	,start : { type: Date, default: Date.now }
	,end  : Date
	,allDay: {type: Boolean,default: true}
	,color: String
	,textColor: String
});

exports=module.exports = mongoose.model('MyEvent', MyEventSchema);
