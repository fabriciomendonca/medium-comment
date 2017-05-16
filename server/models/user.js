const mongoose = require('mongoose');

const { Schema } = mongoose;

const User = mongoose.model('user', new Schema({
  name: {
    type: String,
    required: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true
  }
}));

module.exports = User;