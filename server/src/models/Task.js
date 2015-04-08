'use strict';

var mongoose = require('mongoose'),
     Schema = mongoose.Schema,
     ObjectId = Schema.ObjectId;


var TaskSchema = new Schema({
  title: String,
  project: ObjectId,
  planEffort : Number,
  start : Date ,
  deadline : Date,
  state : String,
  owner : [{type: ObjectId, ref: 'User'} ],
  spec : String,
  examiner : [{type: ObjectId, ref: 'User'} ],
  offset : Number,
  finishDate  : Date
});

exports=module.exports = mongoose.model('Task', TaskSchema);
