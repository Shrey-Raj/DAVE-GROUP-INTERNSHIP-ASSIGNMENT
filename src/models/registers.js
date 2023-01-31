const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  phone:{
    type:Number , 
    minlength:10 , 
    maxlength:10
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  otp:{
    type:String , 
  },
  date: {
    type: Date,
    default: Date.now,
  }
  
});

//Start with capital and shd be Singular
const AllUser = new mongoose.model("AllUser", userSchema);

module.exports =  AllUser;
