// Env Configuration
const { env } = require('./config/config');

const express = require('express'),
      mongoose = require('./db/mongoose'),
      bodyParser = require('body-parser');

// Auth middleware that returns a fixed user (email: test@test.com)
const auth = require('./middleware/auth');

// Grab the createRoutes function from routes file
const {
  createRoutes
} = require('./routes/routes');

const app = express();

// CORS
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

  if (req.method === 'OPTIONS') {
    res.send(200);
  }

  next();
});

// Use the bodyParser.json() middleware
app.use(bodyParser.json());

// Call API Routes creation
createRoutes(app);

// Middleware to send the errors
app.use((err, req, res, next) => {
  res.status(422).send({error: err.message});
});

// Start listening
app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});

// exports the server variable
module.exports = app;