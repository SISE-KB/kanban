'use strict';

var mongoose = require('mongoose'),
     Schema = mongoose.Schema,
     ObjectId = Schema.ObjectId;


var SprintSchema = new Schema({
  name: String,
  capacity : Number,
  start : Date ,
  end : Date,
  projectId: ObjectId
 
});

exports=module.exports = mongoose.model('Sprint', SprintSchema);
