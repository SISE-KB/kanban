var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId


var MySchema = new Schema({
  title: String,
  text: String,
  tags: [String],
  recDate: Date,
  closeDate: Date
})

MySchema.pre('save', function (next) {
	var now = new Date(new Date())
	if(!this.recDate){ 
      this.recDate= now
    }
   	if(!this.closeDate){ 
      this.closeDate= now.setDate(now.getDate()+14)
    }
    next()
 })
exports=module.exports = mongoose.model('Message', MySchema)
