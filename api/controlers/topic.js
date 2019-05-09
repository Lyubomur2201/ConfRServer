const mongoose = require('mongoose');

const Topic = require('../schemas/Topic');

module.exports.getTopicByInviteCode = async (req, res, next) => {
  
  const topic = await Topic.findById(req.params.inviteCode);

  if(!topic)
    return res.status(404).json({ message: 'Topic not found' });

  res.status(200).json({
    id: topic.id,
    body: topic.body,
    inviteCode: topic.inviteCode,
    author: topic.author
  });

};

module.exports.joinTopic = async (req, res, next) => {

  const topic = await Topic.findOne({ inviteCode: req.body.inviteCode });

  if(!topic)
    return res.status(404).json({ message: 'Topic not found' });

  await req.user.update({ '$addToSet': { topics: topic.id } }, (err, raw) => {});

  res.status(200).json({
    id: topic.id,
    body: topic.body,
    inviteCode: topic.inviteCode,
    author: topic.author
  });
};

module.exports.createTopic = async (req, res, next) => {

  const exist = await Topic.findOne({ inviteCode: req.body.inviteCode });

  if(exist) {
    return res.status(400).json(
      { message: 'Topic ' + req.body.inviteCode + ' alredy exists' }
    );
  };

  const topic = await new Topic({
    _id: new mongoose.Types.ObjectId(),
    body: req.body.body,
    inviteCode: req.body.inviteCode,
    author: req.user.id
  }).save();

  await req.user.update({ '$addToSet': { topics: topic.id } }, (err, raw) => {});

  res.status(201).json({
    id: topic.id,
    body: topic.body,
    inviteCode: topic.inviteCode,
    author: topic.author
  });

};