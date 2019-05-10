const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const mailgun = require("mailgun-js")({apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN});
const randomstring = require('randomstring');
const User = require('../schemas/User');

const signToken = async user => {
  const token = await jwt.sign({
    username: user.username,
    id: user._id,
  },
  process.env.JWT_SECRET,
  {
    expiresIn: '1y',
  });

  return token;
};

module.exports.signup = async (req, res, next) => {

  const emailMatches = await User.findOne({ 'local.email': req.body.email });
  if(emailMatches)
    return res.status(400).json({ message: 'Email already in use' });

  const usernameMatches = await User.findOne({ username: req.body.username });
  if(usernameMatches)
    return res.status(400).json({ message: 'Username already in use' });

  const user = await new User({
    _id: mongoose.Types.ObjectId(),
    username: req.body.username,
    local: {
      email: req.body.email,
      password: req.body.password
    },
    verificationCode: randomstring.generate(6),
    created: new Date()
  });

  user.strategy = 'local';
  await user.save();

  const data = {
  	from: 'verify@confR.com',
  	to: `${user.local.email}`,
  	subject: 'Email verification',
    text: 'Verify your email',
    html: `<h2><b>Verification code ${user.verificationCode}</a></h2>`
  };
  mailgun.messages().send(data, (error, body) => {
    if(error) console.error(error);
  });

  res.status(201).json({ message: 'Verify your email' });

};

module.exports.signin = async (req, res, next) => {
  const token = await signToken(req.user);
  return res.status(200).json({ token: token });
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
  res.status(200).json({ message: 'reset' });
};

module.exports.verify = async (req, res, next) => {
  
  const user = await User.findOne({verificationCode: req.body.verificationCode});
  
  if(!user) return res.status(400).json({message: 'Invalid verification code'});
  
  if(user.isActive) return res.status(200).json({message: 'Email already verified'});
  await user.update({$set: {isActive: true}});
  
  const token = await signToken(user);

  res.status(200).json({token: token});

};