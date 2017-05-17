const User = require('../models/user');

const auth = (req, res, next) => {
  User.findOne({
    email: 'test@test.com'
  }).then(data => {
    req.user = data;
    next();
  }).catch((e) => res.status(401).send());
}

module.exports = auth;