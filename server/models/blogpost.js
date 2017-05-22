const mongoose = require('mongoose');
const Comment = require('./comment');
const Highlights = require('./posthighlight');

const { Schema } = mongoose;


const BlogPostSchema = new Schema({
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
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'comment'
    }
  ],
  highlights: [
    {
      type: Schema.Types.ObjectId,
      ref: 'post-highlight'
    }
  ]
});

BlogPostSchema.pre('remove', function(next) {
  const Comment = mongoose.model('comment');
  const Highlight = mongoose.model('posthighlight');

  Promise.all([
    Comment.remove({ _id: { $in: this.comments } }),
    Highlight.remove({ _id: { $in: this.highlights } })
  ])
  .then(() => next());
});

module.exports = mongoose.model('blogpost', BlogPostSchema);