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

    app.post('/posts/:id/comments', auth, PostsController.createComment);
    app.get('/posts/:id/comments', auth, PostsController.getComments);
    app.get('/posts/:id/highlights', auth, PostsController.getHighlights);
    app.post('/posts/:id/highlights', auth, PostsController.createHighlight);
    app.patch('/posts/:id/highlights', auth, PostsController.updateHighlight);
    app.get('/posts/:id', auth, PostsController.get);
    app.delete('/posts/:id', auth, PostsController.delete);
    app.get('/posts', auth, PostsController.getAll);
    app.post('/posts', auth, PostsController.create);
  }
}

// /posts (POST, GET)
// /posts/:id/comments (POST, GET)
