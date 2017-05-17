const UserController = require('../controllers/user');
const PostsController = require('../controllers/blogpost');

const auth = require('../middleware/auth');
// the routes should be
// /users (POST)
// /users/:id (GET)

module.exports = {
  createRoutes (app) {
    app.get('/users/:id', auth, UserController.get);
    app.post('/users', auth, UserController.create);

    app.get('/posts/:id', auth, PostsController.get);
    app.get('/posts', auth, PostsController.getAll);
    app.post('/posts', auth, PostsController.create);

    //app.post('/posts/:id/comments', auth, PostController.createComment);
    //app.get('/posts/:id/comments', auth, PostController.getComments);
  }
}

// /posts (POST, GET)
// /posts/:id/comments (POST, GET)
