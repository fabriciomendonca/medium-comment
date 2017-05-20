const mongoose = require('mongoose');

const { Schema } = mongoose;

const PostHighlight = mongoose.model('post-highlight', new Schema({
  text: {
    type: String,
    minlength: 1
  },
  createdAt: {
    type: Number,
    required: true
  },
  startOffset: {
    type: Number,
    required: true
  },
  endOffset: {
    type: Number,
    required: true
  },
  commentText: {
    type: String,
    trim: true
  },
  _blogPost: {
    type: Schema.Types.ObjectId,
    ref: 'blogpost'
  },
  _comment: {
    type: Schema.Types.ObjectId,
    ref: 'comment'
  },
  _createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  }
}));

module.exports = PostHighlight;