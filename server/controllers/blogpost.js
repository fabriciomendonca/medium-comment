const BlogPost = require('../models/blogpost');
const User = require('../models/user');
const Comment = require('../models/comment');
const Highlight = require('../models/posthighlight');

const { ObjectID } = require('mongodb');

const checkId = (id, res) => {
  if (!ObjectID.isValid(id)) {
    res.status(404).send();
  }
}
module.exports = {
  create (req, res, next) {
    const {
      title,
      text
    } = req.body;

    const post = new BlogPost({
      title,
      text,
      createdAt: new Date().getTime(),
      _createdBy: req.user._id
    });

    post.save()
      .then(data => {
        res.status(200).send(data);
      })
      .catch(next);
  },

  getAll (req, res, next) {
    BlogPost.find({})
      .then(data => {
        res.status(200).send(data);
      })
      .catch(next);
  },

  get (req, res, next) {
    const {
      id
    } = req.params;

    checkId(id, res);

    BlogPost.findById(id)
      .then(data => {
        res.status(200).send(data);
      })
      .catch(next);
  },

  createComment (req, res, next) {
    const {
      text,
    } = req.body;
    const {
      id
    } = req.params;

    checkId(id, res);

    const comment = new Comment({
      text,
      createdAt: new Date().getTime(),
      _blogPost: id,
      _createdBy: req.user._id
    });

    comment.save()
      .then(data => {
        res.status(200).send(data);
      })
      .catch(next);
  },

  getComments (req, res, next) {
    const {
      id
    } = req.params;

    checkId(id, res);

    Comment.find({
      _blogPost: id
    }).then(data => {
      res.status(200).send(data);
    })
    .catch(next);
  },

  getHighlights (req, res, next) {
    const {
      id
    } = req.params;

    checkId(id, res);

    Highlight.find({
      _blogPost: id
    }).then(data => {
      res.status(200).send(data);
    })
    .catch(next);
  },

  createHighlight (req, res, next) {
    const {
      id
    } = req.params;
    
    checkId(id, res);

    const {
      text,
      startIndex,
      endIndex
    } = req.body;

    var hl = new Highlight({
      text,
      startIndex,
      endIndex,
      createdAt: new Date().getTime(),
      _blogPost: id,
      _createdBy: req.user._id,
    });

    let comment;
    if (req.body._comment) {
      comment = new Comment({
        _id: new ObjectID(),
        text: req.body.commentText,
        createdAt: hl.createdAt,
        _blogPost: hl._blogPost,
        _createdBy: hl._createdBy
      });
    }
    
    hl._comment = comment ? comment._id.toHexString() : null;
    
    hl.save()
      .then(data => {
        if (comment) {
          comment.save()
            .then(() => res.status(200).send(data));
        }

        res.status(200).send(data);
      })
      .catch(next);
  }
}