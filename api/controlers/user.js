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