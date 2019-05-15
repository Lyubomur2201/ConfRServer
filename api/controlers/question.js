const mongoose = require('mongoose');

const Topic = require('../schemas/Topic');

module.exports.getAllQuestions = async (req, res, next) => {
  
  const topic = await Topic.findOne({inviteCode: req.topicCode});

  if(!topic)
    return res.status(404).json({ message: 'Topic not found' });

  res.status(200).json(topic.questions.map(question => {
    return {
      id: question.id,
      question: question.question,
      author: question.author,
      upvotes: question.upvotes
    };
  }));

};

module.exports.getQuestionById = async (req, res, next) => {

  const topic = await Topic.findOne({inviteCode: req.topicCode});

  if(!topic)
    return res.status(404).json({ message: 'Topic not found' });

  const question = topic.questions.find(question => question.id == req.params.id);

  if(!question)
    return res.status(404).json({ message: 'Question not found' });

  res.status(200).json({
    id: question.id,
    question: question.question,
    author: question.author,
    upvotes: question.upvotes
  });

};

module.exports.upvoteQuestion = async (req, res, next) => {

  const topic = await Topic.findOne({inviteCode: req.topicCode});

  if(!topic)
    return res.status(404).json({ message: 'Topic not found' });

  const question = topic.questions.find(
    question => question.id == req.params.id
  );

  if(!question)
    return res.status(404).json({ message: 'Question not found' });

  if(question.upvotes.includes(req.user.username)) {
    return res.status(400).json({ message: 'You already upvote this question'});
  };

  question.upvotes.push(req.user.username);

  await topic.save();

  res.status(200).json({ message: 'Question upvoted' });

};

module.exports.deleteQuestion = async (req, res, next) => {

  const topic = await Topic.findOne({inviteCode: req.topicCode});

  if(!topic) return res.status(404).json({ message: 'Topic not found' });

  if(topic.author != req.user.username) return res.status(400).json({ message: 'You cant edit this topic' });

  const question = topic.questions.find(
    question => question.id == req.params.id
  );
  if(!question) return res.status(404).json({message: 'Question not found'});

  topic.questions.splice(topic.questions.indexOf(question));
  await topic.save();

  res.status(200).json({message: 'Question successfuly deleted'});

};

module.exports.createQuestion = async (req, res, next) => {

  const topic = await Topic.findOne({inviteCode: req.topicCode});

  if(!topic) return res.status(404).json({ message: 'Topic not found' });

  const question = {
    id: topic.questions && topic.questions.length + 1 || 1,
    question: req.body.question,
    author: req.user.username
  };

  topic.questions.push(question);

  await topic.save();

  res.status(201).json({
      id: question.id,
      question: question.question,
      author: question.author,
      upvotes: question.upvotes
    });
};