const mongoose = require('mongoose');
const captainSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  isAvailble:{
    type:Boolean,
    default:false
  }
});
const captainModel = mongoose.model('Captain', captainSchema);
module.exports = captainModel;