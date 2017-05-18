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