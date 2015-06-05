'use strict';

var mongoose = require('mongoose'),
     Schema = mongoose.Schema,
     ObjectId = Schema.ObjectId;


var BacklogSchema = new Schema({
   name: String 
  ,desc : String
  ,note : String
  ,catalog: String
  ,projectId: ObjectId
  ,priority : Number
  ,estimation : Number
  ,state  :  {type: String,default: 'TODO'}
  ,finishDate : Date
  ,sprintId : ObjectId
 
});

exports=module.exports = mongoose.model('Backlog', BacklogSchema);
