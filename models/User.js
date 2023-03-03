const mongoose = require('mongoose')
const { Schema } = mongoose;

const userSchema = new Schema({
  name:  {type : String,
        required:true}, // String is shorthand for {type: String}
  email:  {type : String,
            required:true,
            unique:true
        },
    password:  {type : String,
            required:true},
 
  date: { type: Date, default: Date.now }
  
  
  }
);
const Model = mongoose.model('user', userSchema);

module.exports = Model;