'use strict';

var mongoose = require('mongoose'),
     Schema = mongoose.Schema,
     ObjectId = Schema.ObjectId;


var SprintSchema = new Schema({
  name: String,
  desc : String,
  priority : Number ,
  estimation : Number,
  projectId: ObjectId
 
});

exports=module.exports = mongoose.model('Sprint', SprintSchema);
