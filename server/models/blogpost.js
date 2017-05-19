const mongoose = require('mongoose');

const { Schema } = mongoose;

const BlogPost = mongoose.model('blogpost', new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
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
    ref: 'user'
  },
  comments: {
    type: Array
  },
  highlights: {
    type: Array
  }
}));

module.exports = BlogPost;