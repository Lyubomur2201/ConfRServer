const config = require('../../config');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const User = require('../schemas/User');

const signToken = async user => {
  const token = await jwt.sign({
    username: user.username,
    id: user._id,
  },
  config.JWT_SECRET,
  {
    expiresIn: '1y',
  });

  return token;
};

module.exports.signup = async (req, res, next) => {

  const emailMatches = await User.findOne({ 'local.email': req.body.email });
  if(emailMatches) {
    return res.status(400).json({ message: 'Email already in use' });
  };

  const usernameMatches = await User.findOne({ username: req.body.username });
  if(usernameMatches) {
    return res.status(400).json({ message: 'Username already in use' });
  };

  const user = await new User({
    _id: mongoose.Types.ObjectId(),
    username: req.body.username,
    local: {
      email: req.body.email,
      password: req.body.password
    },
    created: new Date()
  });

  user.strategy = 'local';
  await user.save();

  const token = await signToken(user);

  res.status(201).json({
    message: 'User was saccessfuly created',
    token: token
  });

};

module.exports.signin = async (req, res, next) => {
  const token = await signToken(req.user);
  return res.status(200).json({
    token: token
  });
};


module.exports.google = async (req, res, next) => {
  const token = await signToken(req.user);
  return res.status(200).json({ token: token });
};

module.exports.facebook = async (req, res, next) => {
  const token = await signToken(req.user);
  return res.status(200).json({ token: token });
};

module.exports.reset = async (req, res, next) => {
  // TODO reset funct
  res.status.json({ message: 'reset' });
};

module.exports.activate = async (req, res, next) => {
  // TODO activate funct
  res.status.json({ message: 'activate' });
};