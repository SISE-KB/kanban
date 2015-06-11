'use strict';

var mongoose = require('mongoose'),
     Schema = mongoose.Schema,
     ObjectId = Schema.ObjectId;

var ProjectSchema = new Schema({
	 name : String
	,catalog : String
	,tags : String
	,productOwnerId: ObjectId
	,devMasterId: ObjectId
	,teamMembers: [ObjectId]
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
*/
 
module.exports = mongoose.model('Project', ProjectSchema);
