const request = require('supertest');
const expect = require('expect');
const { ObjectID } = require('mongodb');

const app = require('../index');

// Models
const User = require('../models/user');
const user = {
  _id: new ObjectID(),
  name: 'Test user',
  email: 'test@test.com'
};

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

  it('should get a user', (done) => {
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

  xit('should create a post', (done) => {
    
  });

  xit('should get the post content', (done) => {

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