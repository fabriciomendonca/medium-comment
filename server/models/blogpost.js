const mongoose = require('mongoose');

const { Schema } = mongoose;

const BlogPost = mongoose.model('blogpost', new Schema({
  text: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Number,
    required: true,
    default: 0
  },
  _createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    red: 'user'
  }
}));

module.exports = BlogPost;