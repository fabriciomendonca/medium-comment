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
      .populate({
        path: 'comments',
        populate: {
          path: '_createdBy',
          model: 'user'
        }
      })
      .populate({
        path: 'highlights',
        populate: {
          path: '_createdBy',
          model: 'user'
        }
      })
      .populate('_createdBy')
      .then(post => res.status(200).send(post))
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
      _createdBy: req.user._id
    });

    Promise.all([BlogPost.findById(id), comment.save()])
      .then(data => {
        const post = data[0];
        post.comments.push(data[1]);
        post.save()
          .then(() => {
            res.status(200).send(data[1])
          })
          .catch(next);
      })
      .catch(next);
  },

  getComments (req, res, next) {
    const {
      id
    } = req.params;

    checkId(id, res);

    BlogPost.findById(id)
      .populate({
        path: 'comments',
        populate: {
          path: '_createdBy',
          model: 'user'
        }
      })
      .then(data => {
        res.status(200).send(data.comments);
      })
      .catch(next);
  },

  getHighlights (req, res, next) {
    const {
      id
    } = req.params;

    checkId(id, res);

    BlogPost.findById(id)
      .populate({
        path: 'highlights',
        populate: {
          path: '_createdBy',
          model: 'user'
        }
      })
      .then(data => {
        res.status(200).send(data.highlights);
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
      startOffset,
      endOffset
    } = req.body;

    var hl = new Highlight({
      text,
      startOffset,
      endOffset,
      createdAt: new Date().getTime(),
      _createdBy: req.user._id,
    });

    let comment;
    if (req.body._comment || req.body.commentText) {
      comment = new Comment({
        _id: new ObjectID(),
        text: req.body.commentText,
        createdAt: hl.createdAt,
        _createdBy: hl._createdBy
      });
    }
    
    hl._comment = comment ? comment._id.toHexString() : null;
    hl.commentText = comment ? comment.text : null;

    const promises = [hl];
    if (comment) {
      promises.push(comment);
    }
    
    Promise.all(promises.map(p => p.save()))
      .then((results) => {
        const update = {
          highlights: hl._id
        };
        if (comment) {
          update.comments = comment._id;
        }
        
        BlogPost.update(
          {_id: id},
          {$push: update}
        ).then(() => {
          res.status(200).send({
            highlight: results[0],
            comment
          });
        })
        .catch(next);
      })
  },

  updateHighlight (req, res, next) {
    const {
      _id,
      commentText
    } = req.body;

    if (commentText.trim() === '') next();

    const {
      id
    } = req.params;

    if (!ObjectID.isValid(id)) {
      res.status(404).send();
    }

    Highlight.findById(_id)
      .populate('_comment')
      .then(highlight => {
        let promises = [], comment;

        if (!highlight._comment) {
          comment = new Comment({
            text: commentText,
            createdAt: new Date().getTime(),
            _createdBy: req.user._id
          });
          
          highlight._comment = comment;
          Promise.all([comment.save(), highlight.save()])
            .then(() => {
              res.status(200).send({
                highlight,
                comment
              });
            });
        } else {
          highlight.commentText = commentText;
          Promise.all([
            Comment.findByIdAndUpdate(highlight._comment, {text: commentText}),
            highlight.save()
          ]).then(() => {
            Comment.findById(highlight._comment).then(comment => {
              res.status(200).send({
                highlight,
                comment
              });
            })
          });
        }
      })
      .catch(next);
  },

  delete (req, res, next) {
    const {
      id
    } = req.params;

    if (!ObjectID.isValid(id)) {
      res.status(404).send();
    }

    BlogPost.findByIdAndRemove(id)
      .then(data => {
        res.status(200).send(data);
      })
      .catch(next);
  }
}