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
      text: 'This is a brand new blog post',
      createdAt: new Date().getMilliseconds(),
      _createdBy: new ObjectID()
    });

    post.save()
      .then(res => {
        expect(res.text).toBe('This is a brand new blog post');
        expect(res.createdAt).toExist();
        return done();
      })
      .catch(e => done(e));
  });

  it('should create a comment with a fake postId and userId', (done) => {
    const comment = new Comment({
      text: 'This is a comment',
      createdAt: new Date().getMilliseconds(),
      _createdBy: new ObjectID(),
      _blogPost: new ObjectID()
    });

    comment.save()
      .then(res => {
        expect(res.text).toBe('This is a comment');
        expect(res.createdAt).toExist();
        expect(res._blogPost).toExist();
        expect(res._createdBy).toExist();
        return done();
      })
      .catch(e => done(e));
  });

  it('should create a highlight with a fake userId without a comment', (done) => {
    const highlight = new PostHighlight({
      text: 'text highlighted',
      startIndex: 10,
      endIndex: 20,
      createdAt: new Date().getMilliseconds(),
      _blogPost: new ObjectID(),
      _createdBy: new ObjectID()
    });

    highlight.save()
      .then(res => {
        expect(res.text).toBe('text highlighted');
        expect(res.startIndex).toBe(10);
        expect(res.endIndex).toBe(20);
        expect(res.createdAt).toExist();
        expect(res._blogPost).toExist();
        expect(res._createdBy).toExist();
        return done();
      })
      .catch(e => done(e));
  });

  it('should create a highlight with a fake userId and with a comment', (done) => {
    const highlight = new PostHighlight({
      text: 'text highlighted',
      startIndex: 10,
      endIndex: 20,
      createdAt: new Date().getMilliseconds(),
      _blogPost: new ObjectID(),
      _comment: new ObjectID(),
      _createdBy: new ObjectID()
    });

    highlight.save()
      .then(res => {
        expect(res.text).toBe('text highlighted');
        expect(res.startIndex).toBe(10);
        expect(res.endIndex).toBe(20);
        expect(res.createdAt).toExist();
        expect(res._blogPost).toExist();
        expect(res._createdBy).toExist();
        expect(res._comment).toExist();
        return done();
      })
      .catch(e => done(e));
  });
});