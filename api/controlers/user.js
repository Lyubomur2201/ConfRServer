const mailgun = require("mailgun-js")({apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN});
const randomstring = require('randomstring');
const User = require('../schemas/User');

module.exports.getUser = async (req, res, next) => {

  const user = await User.findOne({username: req.params.username});

  if(!user)
    return res.status(404).json({ message: 'User not found' });

  res.status(200).json({
    username: user.username,
    email: user.local.email || user.google.email || user.facebook.email
  });

};

module.exports.getMyUser = (req, res, next) => {
  
  res.status(200).json({
    username: req.user.username,
    email: req.user.local.email || req.user.google.email || req.user.facebook.email
  });

};

module.exports.resetStart = async (req, res, next) => {

  const user = await User.findOne({username: req.body.username});

  if(!user) return res.status(404).json({message: 'User not found'});

  const resetCode = randomstring.generate(8);

  await user.update({$set: {resetCode: resetCode}});
  
  const data = {
    from: 'reset@confR.com',
  	to: `${user.local.email}`,
  	subject: 'Password reset',
    html: `<h2><b>Password reset code ${resetCode}</a></h2>`
  };

  mailgun.messages().send(data, (error, body) => {
    if(error) console.error(error);
  });

  res.status(200).json({ message: 'Reset code was sent to your email' });
};

module.exports.resetEnd = async (req, res, next) => {

  const user = await User.findOne({resetCode: req.body.resetCode});

  if(!user) return res.status(400).json({message: 'Wrong resert code'});
  
  await user.update({$set: {password: req.body.newPassword, strategy: 'password-reset'}});

  res.status(200).json({ message: 'Password successfully reseted' });
};