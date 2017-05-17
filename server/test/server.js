const request = require('supertest');
const expect = require('expect');
const { ObjectID } = require('mongodb');

const app = require('../index');

// Models
const User = require('../models/user');
const BlogPost = require('../models/blogpost');

const user = {
  _id: new ObjectID(),
  name: 'Test user',
  email: 'test@test.com'
};

const postList = [
  {
    _id: new ObjectID(),
    title: 'Firts test post',
    text: 'This is the content of the first test post',
    createdAt: new Date().getMilliseconds(),
    _createdBy: user._id.toHexString()
  },
  {
    _id: new ObjectID(),
    title: 'Second test post',
    text: 'This is the content of the second test post',
    createdAt: new Date().getMilliseconds(),
    _createdBy: user._id.toHexString()
  }
];

describe('Test the API for comment a highlighted text', () => {
  beforeEach(done => {
    User.remove({}).then(() => {
      return User.create(user);
    })
    .then(() => done());
  });

  it('should create a user (POST /users)', (done) => {
    const body = {
      name: 'Fabricio Mendonca',
      email: 'fabriciomendonca@gmail.com'
    };

    request(app)
      .post('/users')
      .send(body)
      .expect(200)
      .expect(res => {
        expect(res.body.name).toBe(body.name)
        expect(res.body.email).toBe(body.email);
      })
      .end(done);
  });

  it('should get a user (GET /users:id)', (done) => {
    request(app)
      .get(`/users/${user._id}`)
      .expect(200)
      .expect(res => {
        expect(res.body._id).toBe(user._id.toHexString());
        expect(res.body.name).toBe(user.name);
        expect(res.body.email).toBe(user.email);
      })
      .end(done);
  });

  beforeEach(done => {
    BlogPost.remove({})
      .then(() => {
        return BlogPost.insertMany(postList)
      })
      .then(() => done());
  });

  it('should create a post (POST /posts)', (done) => {
    const body = {
      title: 'Third test post',
      text: 'This is the content of the third test post'
    };

    request(app)
      .post('/posts')
      .send(body)
      .expect(200)
      .expect(res => {
        expect(res.body.title).toBe('Third test post');
        expect(res.body.text).toBe('This is the content of the third test post');
        expect(res.body._createdBy).toExist();
        expect(res.body.createdAt).toExist();
      })
      .end(done);
  });

  it('should get all posts (GET /posts)', (done) => {
    request(app)
      .get(`/posts`)
      .expect(200)
      .expect(res => {
        expect(res.body.length).toBe(postList.length);
        expect(res.body[0].title).toBe(postList[0].title);
      })
      .end(done);
  });

  it('should get a post content (GET /posts/:id)', done => {
    request(app)
      .get(`/posts/${postList[0]._id}`)
      .expect(200)
      .expect(res => {
        expect(res.body.title).toBe(postList[0].title);
        expect(res.body.text).toBe(postList[0].text);
      })
      .end(done);
  });

  xit('should create a comment for a post', (done) => {

  });

  xit('should create a highlight for a post', (done) => {
    // A highlight should have
    // user
    // text
    // startIndex
    // endIndex
    // related comment
  });
});