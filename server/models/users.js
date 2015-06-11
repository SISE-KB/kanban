'use strict';

var mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
   

var UserSchema = new Schema({
	code : { type: String,  index: true},
	password: String,
	name : String,
	mobileNo : { type: String, index: true},
	type : String,
	isAdmin:{type: Boolean,default: false},
	isActive :  {type: Boolean,default: true},
	regDate :  { type: Date, default: Date.now },

	image : String,
	skills : [String],
	sex : String,
	hostel : String,
	desc : String
});

UserSchema.plugin(passportLocalMongoose,{
	usernameField :'code',
	hashField:'password',
	saltlen:8,
	keylen:32
});


UserSchema.pre('save', function (next) {
    if(this.password&&this.password.length < 20){ 
		  this.setPassword(this.password,function(err,user){
			  console.log("setPasswod:",user.password);
			  if(err) console.log("setPasswod ERROR");
			  else
			    next();
		  });
	}else{
      next();
	}	
});

module.exports = mongoose.model('User', UserSchema);
