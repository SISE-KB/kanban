module.exports = exports = function passwordPlugin (schema, options) {
 
  
  schema.pre('save', function (next) {
	if(this.password&&this.password.length < 20){ 
        this.setPassword(this.password,function(err,user){
		   console.log(user);
		});
    }
    next();
  })
  /*
  if (options && options.index) {
    schema.path('lastMod').index(options.index)
  }*/
}
