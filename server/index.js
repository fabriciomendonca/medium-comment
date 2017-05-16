const { env } = require('./config/config');

const express = require('express'),
      mongoose = require('./db/mongoose'),
      bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

//createRoutes(app);

app.use((err, req, res, next) => {
  res.status(422).send({error: err.message});
});

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});

module.exports = { app };