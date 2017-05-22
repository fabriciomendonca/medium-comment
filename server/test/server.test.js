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

const postList = [{
    _id: new ObjectID(),
    title: 'Firts test post',
    text: 'This is the content of the first test post',
    createdAt: new Date().getTime(),
    _createdBy: user._id
  },
  {
    _id: new ObjectID(),
    title: 'Second test post',
    text: 'This is the content of the second test post',
    createdAt: new Date().getTime(),
    _createdBy: user._id
  }
];

const commentList = [
  {
    _id: new ObjectID(),
    createdAt: new Date().getTime(),
    text: 'Comment for the first post',
    _createdBy: user._id
  },
  {
     _id: new ObjectID(),
    createdAt: new Date().getTime(),
    text: 'Comment for the second post',
    _createdBy: user._id
  }
];

const highlightList = [
  {
    _id: new ObjectID(),
    text: 'first',
    commentText: 'new text',
    createdAt: new Date().getTime(),
    startOffset: 0,
    endOffset: 8,
    _createdBy: user._id
  },
  {
    _id: new ObjectID(),
    text: 'second',
    commentText: 'new text',
    createdAt: new Date().getTime(),
    startOffset: 0,
    endOffset: 8,
    _createdBy: user._id
  }
]

describe('Test the API for comment a highlighted text', () => {
  beforeEach(done => {
    Promise.all([
      User.remove({}),
      BlogPost.remove({}),
      Comment.remove({}),
      Highlight.remove({})
    ])
    .then(() => {
      let posts = [],
          comments = [],
          highlights = [],
          promises = [];
      for(let i = 0 ; i < 2 ; i++) {
        posts[i] = new BlogPost(postList[i]);
        comments[i] = new Comment(commentList[i]);
        highlights[i] = new Highlight(highlightList[i]);
        posts[i].comments.push(comments[i]);
        posts[i].highlights.push(highlights[i]);
        promises = [
          ...promises,
          posts[i],
          comments[i],
          highlights[i]
        ];
      }
      promises.push(new User(user));

      return Promise.all(promises.map(p => p.save()));
    })
    .then(() => done())
    .catch(done);
  });

  it('should create a user (POST /users)', done => {
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

  it('should get a user (GET /users:id)', done => {
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

  it('should get all posts (GET /posts)', done => {
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

  it('should create a comment for a post (POST /posts/:id/comments', done => {
    const body = {
      text: 'A simple comment for a post',
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
    const post = new BlogPost({
      _id: new ObjectID(),
      title: 'test post',
      text: 'text',
      createdAt: new Date().getTime(),
      _createdBy: user._id
    });
    const comment = new Comment({
      text: 'A simple comment for a post',
      _createdBy: user._id.toHexString()
    });

    post.comments.push(comment);

    Promise.all([comment.save(), post.save()])
      .then(() => {
        request(app)
          .get(`/posts/${post._id.toHexString()}/comments`)
          .expect(200)
          .expect(res => {
            expect(res.body.length).toBe(1);
            expect(res.body[0].text).toBe(comment.text);
          })
          .end(done);
      });
  });

  it('should create a highlight for a post (POST /posts/:id/highlights)', done => {
    const body = {
      text: 'of the first',
      commentText: 'With command',
      startOffset: 6,
      endOffset: 18
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

  it('should get posts highlights (GET /posts/:id/highlights)', done => {
    const post = new BlogPost({
      _id: new ObjectID(),
      title: 'test post',
      text: 'text',
      createdAt: new Date().getTime(),
      _createdBy: user._id
    });

    const highlight = new Highlight({
      _id: new ObjectID(),
      text: 'selected',
      commentText: 'new text',
      createdAt: new Date().getTime(),
      startOffset: 0,
      endOffset: 8,
      _createdBy: user._id
    });
    post.highlights.push(highlight);

    Promise.all([highlight.save(), post.save()])
      .then(() => {
        request(app)
          .get(`/posts/${post._id.toHexString()}/highlights`)
          .expect(200)
          .expect(res => {
            expect(res.body.length).toBe(1);
            expect(res.body[0].text).toBe('selected');
          })
          .end(done);
      })
      .catch(done);
  });

  it('should update a highlight text (PATCH /post/:id/highlights)', done => {
    const post = new BlogPost({
      _id: new ObjectID(),
      title: 'test post',
      text: 'text',
      createdAt: new Date().getTime(),
      _createdBy: user._id
    });

    const highlight = new Highlight({
      _id: new ObjectID(),
      text: 'selected',
      commentText: 'new text',
      createdAt: new Date().getTime(),
      startOffset: 0,
      endOffset: 8,
      _createdBy: user._id
    });
    post.highlights.push(highlight);

    Promise.all([highlight.save(), post.save()])
      .then(() => {
        const body = {
          _id: highlight._id,
          commentText: 'Comment text'
        };
        request(app)
          .patch(`/posts/${postList[0]._id.toHexString()}/highlights`)
          .send(body)
          .expect(200)
          .expect(res => {
            expect(res.body.commentText).toBe('Comment text');
          })
          .end(done)
      });
  });

  it('should delete a post (DELETE /posts/:id)', done => {
    
    request(app)
      .delete(`/posts/${postList[0]._id.toHexString()}`)
      .expect(200)
      .expect(res => {
        expect(res.body._id).toBe(postList[0]._id.toHexString());
      })
      .end(done);
  });
});