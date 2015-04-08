'use strict';

var mongoose = require('mongoose'),
     Schema = mongoose.Schema,
     ObjectId = Schema.ObjectId;


var MessageSchema = new Schema({
  title: String,
  text: String,
  recDate:{type: Date, default: Date.now}
});

exports=module.exports = mongoose.model('Message', MessageSchema);
