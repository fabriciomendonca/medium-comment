const UserController = require('../controllers/user');
// the routes should be
// /users (POST)
// /users/:id (GET)

module.exports = {
  createRoutes (app) {
    app.get('/users/:id', UserController.get);
    app.post('/users', UserController.create);
  }
}

// /posts (POST, GET)
// /posts/:id/comments (PATCH, GET)
// /comments (POST, GET)
// /comments/:id