'use strict';

var mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
      

var UserSchema = new Schema({
  name : String,	
  mobileNo : String,
  password:String,
  isAdmin:{type: Boolean,default: false},
  skills : [String],
  catalog : [String],
  isActive :  {type: Boolean,default: true},
  regDate :  { type: Date, default: Date.now },
  sex : String,
  code : String,
  hostel : String,
  desc : String

 // projects : [{type: ObjectId, ref: 'Project'} ]
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
		    next();
		});
    }
   
  })

UserSchema.statics.JoinProject = function (userId,pid,cb) {
   this.findById(userId,function(err,u){
		  if(err) throw err;
		  //todo:if pid not in projects
	      u.projects.push(pid);
	      u.save(cb);  
    });
};
UserSchema.statics.loadData = function (query) {
 return  this.find(query)
   .select('-__v')
   .populate('projects','name')
   .exec();
 };



module.exports = mongoose.model('User', UserSchema);
