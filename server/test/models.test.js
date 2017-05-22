const config = require('../config/config');
const mongoose = require('../db/mongoose');

const expect = require('expect');
const User = require('../models/user');
const BlogPost = require('../models/blogpost');
const Comment = require('../models/comment');
const PostHighlight = require('../models/posthighlight');

const { ObjectID } = require('mongodb');

describe('Test the MongoDB models', () => {
  it('should create a user', (done) => {
    const user = new User({
      name: 'Fabricio Mendonca',
      email: 'fabriciomendonca@gmail.com'
    });

    user.save()
      .then(res => {
        expect(res.name).toBe('Fabricio Mendonca');
        expect(res.email).toBe('fabriciomendonca@gmail.com');
        return done();
      })
      .catch(e => done(e));
  });

  it('should create a post with a fake userId', (done) => {
    const post = new BlogPost({
      title: 'New post',
      text: 'This is a brand new blog post',
      createdAt: new Date().getTime(),
      _createdBy: new ObjectID()
    });

    post.save()
      .then(res => {
        expect(res.title).toBe('New post')
        expect(res.text).toBe('This is a brand new blog post');
        expect(res.createdAt).toExist();
        return done();
      })
      .catch(e => done(e));
  });

  it('should create a comment with a fake userId', (done) => {
    const comment = new Comment({
      text: 'This is a comment',
      createdAt: new Date().getTime(),
      _createdBy: new ObjectID(),
    });

    comment.save()
      .then(res => {
        expect(res.text).toBe('This is a comment');
        expect(res.createdAt).toExist();
        expect(res._createdBy).toExist();
        return done();
      })
      .catch(e => done(e));
  });

  it('should create a highlight with a fake userId without a comment', (done) => {
    const highlight = new PostHighlight({
      text: 'text highlighted',
      startOffset: 10,
      endOffset: 20,
      createdAt: new Date().getTime(),
      _createdBy: new ObjectID()
    });

    highlight.save()
      .then(res => {
        expect(res.text).toBe('text highlighted');
        expect(res.startOffset).toBe(10);
        expect(res.endOffset).toBe(20);
        expect(res.createdAt).toExist();
        expect(res._createdBy).toExist();
        return done();
      })
      .catch(e => done(e));
  });

  it('should create a highlight with a fake userId and with a comment', (done) => {
    const highlight = new PostHighlight({
      text: 'text highlighted',
      startOffset: 10,
      endOffset: 20,
      createdAt: new Date().getTime(),
      _comment: new ObjectID(),
      _createdBy: new ObjectID()
    });

    highlight.save()
      .then(res => {
        expect(res.text).toBe('text highlighted');
        expect(res.startOffset).toBe(10);
        expect(res.endOffset).toBe(20);
        expect(res.createdAt).toExist();
        expect(res._createdBy).toExist();
        expect(res._comment).toExist();
        return done();
      })
      .catch(e => done(e));
  });
});

describe('Test models realations', () => {
    let user, post, comment, highlight;

    beforeEach((done) => {
      Promise.all([User.remove({}), Comment.remove({}), PostHighlight.remove({}), BlogPost.remove({})])
        .then(() => done())
        .catch(done);
    });

    beforeEach((done) => {
      user = new User({
        _id: new ObjectID(),
        name: 'Test relations',
        email: 'test@realations.com'
      });

      post = new BlogPost({
        _id: new ObjectID(),
        title: 'New post',
        text: 'This is a brand new blog post',
        createdAt: new Date().getTime(),
      });
      post._createdBy = user;

      comment = new Comment({
        _id: new ObjectID(),
        text: 'Comment text',
        createdAt: new Date().getTime()
      });
      comment._createdBy = user;
      post.comments.push(comment);

      highlight = new PostHighlight({
        _id: new ObjectID(),
        text: 'Thi',
        createdAt: new Date().getTime(),
        startOffset: 0,
        endOffset: 3,
      });
      highlight._createdBy = user;
      post.highlights.push(highlight);

      Promise.all([user.save(), comment.save(), highlight.save(), post.save()])
        .then(() => done())
        .catch(done);
    });

    it('should create a post with a comment and a highlight', (done) => {
        BlogPost.findById(post._id)
          .populate({
            path: 'comments',
            populate : {
              path: '_createdBy',
              model: 'user'
            }
          })
          .populate({
            path: 'highlights',
            populate : {
              path: '_createdBy',
              model: 'user'
            }
          })
          .populate('_createdBy')
          .then(data => {
            expect(data.comments.length).toBe(1);
            expect(data.highlights.length).toBe(1);
            expect(data._createdBy.name).toBe('Test relations');
            expect(data.comments[0]._createdBy.name).toBe('Test relations');

            done();
          })
          .catch(done);
    });
  });