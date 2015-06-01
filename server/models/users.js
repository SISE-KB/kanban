'use strict';

var mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
//var hooker = require('hooker');      

var UserSchema = new Schema({
  name : String,	
  mobileNo : String,
  image : String,
  skills : [String],
  password:String,
  isAdmin:{type: Boolean,default: false},
  type : String,
  isActive :  {type: Boolean,default: true},
  regDate :  { type: Date, default: Date.now },
  sex : String,
  code : String,
  hostel : String,
  desc : String
});

UserSchema.plugin(passportLocalMongoose,{
	usernameField :'mobileNo',
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



UserSchema.statics.loadData = function (query) {
 return  this.find(query).select('name mobileNo')
 };



module.exports = mongoose.model('User', UserSchema);
