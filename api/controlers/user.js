const mailgun = require("mailgun-js")({apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN});
const randomstring = require('randomstring');

const User = require('../database/models/User');

module.exports.getUser = async (req, res, next) => {

  const user = await User.findOne({
    where: {username: req.params.username},
  });
  
  if(!user)
  return res.status(404).json({message: 'User not found'});
  
  res.status(200).json({
    username: user.username,
    email: user.email
  });
  
};

module.exports.getMyUser = (req, res, next) => {
  
  res.status(200).json({
    username: req.user.username,
    email: req.user.email,
    topics: req.user.Topics.map(topic => {
      return {
        id: topic.id,
        inviteCode: topic.inviteCode,
        body: topic.body,
        role: topic.TopicRole.role
      }
    }),
  });

};


module.exports.forgot = async (req, res, next) => {

  const user = await User.findOne({
    where: {username: req.body.username}
  });

  if(!user)
    return res.status(404).json({message: 'User not found'});

  const resetCode = randomstring.generate(8);

  user.setDataValue('resetCode', resetCode);
  await user.save();

  const data = {
    from: 'reset@confR.com',
  	to: `${user.email}`,
  	subject: 'Password reset',
    html: `<h2><b>Password reset code ${resetCode}</a></h2>`
  };

  mailgun.messages().send(data, (error, body) => {
    if(error) console.error(error);
  });

  res.status(200).json({message: 'Reset code was sent to your email'});
};

module.exports.reset = async (req, res, next) => {

  const user = await User.findOne({
    where: {resetCode: req.body.resetCode}
  });

  if(!user) 
    return res.status(400).json({message: 'Wrong resert code'});
  
  user.setDataValue('password', req.body.newPassword)
  await user.save({passwordReset: true});

  res.status(200).json({message: 'Password successfully reseted'});
};