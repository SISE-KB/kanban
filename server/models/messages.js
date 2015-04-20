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
	var now = new Date()
	if(!this.recDate){ 
      recDate= now
    }
   	if(!this.closeDate){ 
      closeDate : now.setDate(now.getDate()+14)
    }
    next()
 })
exports=module.exports = mongoose.model('Message', MySchema)
