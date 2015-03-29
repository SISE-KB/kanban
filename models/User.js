'use strict';

var mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
        

var UserSchema = new Schema({
  nickname: String,	
  birthdate: Date
});

UserSchema.plugin(passportLocalMongoose,{
	usernameField:'username',
	selectFields:'-__v'});
module.exports = mongoose.model('User', UserSchema);
