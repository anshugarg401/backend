const mongoose = require('mongoose')
const { Schema } = mongoose;

const notesSchema = new Schema({
  user:{ 
    type: mongoose.Schema.Types.ObjectId,
    ref:'user'     
  },
  title:  String, // String is shorthand for {type: String}
  discription: String,
  tag: { type:String, default:"general" },
  
  date: { type: Date, default: Date.now },
  
  
});
const Model = mongoose.model('notes', notesSchema);
module.exports = Model;