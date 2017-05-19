const request = require('supertest');
const expect = require('expect');
const { ObjectID } = require('mongodb');

const app = require('../index');

// Models
const User = require('../models/user');
const BlogPost = require('../models/blogpost');
const Comment = require('../models/comment');
const Highlight = require('../models/posthighlight');

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

const commentList = [
  {
    _id: new ObjectID(),
    text: 'New comment for post 0',
    _blogPost: postList[0]._id,
    _createdBy: user._id.toHexString()
  },
  {
    _id: new ObjectID(),
    text: 'New comment for post 1',
    _blogPost: postList[1]._id,
    _createdBy: user._id.toHexString()
  },
  {
    _id: new ObjectID(),
    text: 'Another new comment for post 0',
    _blogPost: postList[0]._id,
    _createdBy: user._id.toHexString()
  },
  {
    _id: new ObjectID(),
    text: 'Another comment for post 0!!!',
    _blogPost: postList[0]._id,
    _createdBy: user._id.toHexString()
  },
  {
    _id: new ObjectID(),
    text: 'Another comment for post 1',
    _blogPost: postList[1]._id,
    _createdBy: user._id.toHexString()
  }
];

const highLights = [
  {
    _id: new ObjectID(),
    text: 'is the content',
    createdAt: new Date().getTime(),
    startIndex: 5,
    endIndex: 18,
    _createdBy: user._id,
    _blogPost: postList[0]._id.toHexString()
  },
  {
    _id: new ObjectID(),
    text: 'of the second',
    createdAt: new Date().getTime(),
    startIndex: 5,
    endIndex: 18,
    _createdBy: user._id,
    _blogPost: postList[1]._id.toHexString()
  }
]

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

  beforeEach(done => {
    Comment.remove({})
      .then(() => {
        return Comment.insertMany(commentList);
      })
      .then(() => done());
  });

  it('should create a comment for a post (POST /posts/:id/comments', (done) => {
    const body = {
      text: 'A simple comment for a post',
      _blogPost: postList[0]._id.toHexString(),
      _createdBy: user._id.toHexString()
    };
    request(app)
      .post(`/posts/${postList[0]._id.toHexString()}/comments`)
      .send(body)
      .expect(200)
      .expect(res => {
        expect(res.body.text).toBe(body.text);
        expect(res.body.createdAt).toExist();
      })
      .end(done);
  });

  it('should get a post comments (GET /posts/:id/comments)', done => {
    request(app)
      .get(`/posts/${postList[1]._id.toHexString()}/comments`)
      .expect(200)
      .expect(res => {
        expect(res.body.length).toBe(2);
        expect(res.body[0].text).toBe(commentList[1].text);
      })
      .end(done);
  });

  beforeEach(done => {
    Highlight.remove({})
      .then(() => {
        return Highlight.insertMany(highLights);
      })
      .then(() => {
        done()
      });
  });

  it('should create a highlight for a post (POST /posts/:id/highlights)', (done) => {
    const body = {
      text: 'of the first',
      startIndex: 6,
      endIndex: 18
    };
    
    request(app)
      .post(`/posts/${postList[0]._id.toHexString()}/highlights`)
      .send(body)
      .expect(200)
      .expect(res => {
        expect(res.body.text).toBe(body.text);
      })
      .end(done);
  });

  it('should get posts highlights', done => {
    request(app)
      .get(`/posts/${postList[1]._id.toHexString()}/highlights`)
      .expect(200)
      .expect(res => {
        expect(res.body.length).toBe(1);
      })
      .end(done);
  });

  it('should update a highlight text', done => {
    const highlight = {
      _id: highLights[0]._id,
      commentText: 'new text'
    };
    request(app)
      .patch(`/posts/${postList[0]._id.toHexString()}/highlights`)
      .send(highlight)
      .expect(200)
      .expect(res => {
        expect(res.body.commentText).toBe(highlight.commentText)
      })
      .end(done);
  });

  it('should delete a post', done => {
    request(app)
      .delete(`/posts/${postList[0]._id.toHexString()}`)
      .expect(200)
      .expect(res => {
        expect(res.body._id).toBe(postList[0]._id.toHexString());
      })
      .end(done);
  });
});