const BlogPost = require('../models/blogpost');
const User = require('../models/user');

const { ObjectID } = require('mongodb');

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


    if (!ObjectID.isValid(id)) {
      res.status(404).send();
    }

    BlogPost.findById(id)
      .then(data => {
        console.log(id, data)
        res.status(200).send(data);
      })
      .catch(next);
  }
}