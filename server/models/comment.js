const mongoose = require('mongoose');

const { Schema } = mongoose;

const Comment = mongoose.model('comment', new Schema({
  text: {
    type: String,
    trim: true,
    requried: true
  },
  createdAt: {
    type: Number,
    required: true,
    default: 0
  },
  _createdBy: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'user'
  }
}));

module.exports = Comment;