const mongoose = require('mongoose');

const User = require('../schemas/User');

module.exports.getAllUsers = async (req, res, next) => {
 
  const users = await User.find();

  res.status(200).json(users.map(user => {
      return {
        id: user.id,
        email: user.email,
        username: user.username
      };
    })
  );

};

module.exports.getUserByEmail = async (req, res, next) => {

  const user = await User.findOne({ email: req.params.email });

  if(!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(201).json({
    id: user.id,
    email: user.email,
    username: user.username
  });

};

module.exports.createUser = async (req, res, next) => {

  const exist = await User.findOne({ email: req.body.email });

  if(exist) {
    return res.status(400).json(
      { message: 'User with email ' + req.body.email + ' alredy exists' }
      );
  }

  const user = await new User({
    _id: new mongoose.Types.ObjectId(),
    ...req.body
  }).save();

  res.status(201).json({
    id: user.id,
    email: user.email,
    username: user.username
  });

};
