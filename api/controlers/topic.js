const mongoose = require('mongoose');

const Topic = require('../schemas/Topic');

module.exports.getAllTopics = async (req, res, next) => {
  
  const topics = await Topic.find();

  res.status(200).json(topics.map(topic => {
      return {
        id: topic.id,
        title: topic.title
      };
    })
  );

};

module.exports.getTopicById = async (req, res, next) => {

  const topic = await Topic.findById(req.params.id);


  if(!topic) {
    return res.status(404).json({ message: 'Topic not found' });
  }

  res.status(200).json({
    id: topic.id,
    title: topic.title
  });

};

module.exports.createTopic = async (req, res, next) => {

  const exist = await Topic.findOne({ title: req.body.title });

  if(exist) {
    return res.status(400).json(
      { message: 'Topic ' + req.body.title + ' alredy exists' }
      );
  }

  const topic = await new Topic({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title
  }).save();

  res.status(201).json({
    id: topic.id,
    title: topic.title
  });

};