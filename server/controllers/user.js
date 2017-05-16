const User = require('../models/user');
const { ObjectID } = require('mongodb');

module.exports = {
  create (req, res, next) {
    const {
      name,
      email
    } = req.body;

    const user = new User({
      name,
      email
    });

    user.save()
      .then(data => {
        res.status(200).send(data);
      })
      .catch(next);
  },

  get (req, res, next) {
    const {
      id
    } = req.params;

    if (!ObjectID.isValid(id)) {
      res.status(404).send();
    }

    User.findById(id)
      .then(data => {
        res.status(200).send(data);
      })
      .catch(next);
  }
}