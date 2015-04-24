'use strict';

var mongoose = require('mongoose'),
     Schema = mongoose.Schema,
     ObjectId = Schema.ObjectId;


var SprintSchema = new Schema({
	 projectId: ObjectId
	,name: String
	,capacity : Number
	,effort : Number
	,start : Date
	,end : Date
	,finishDate : Date
	,note : String
 
});

exports=module.exports = mongoose.model('Sprint', SprintSchema);
