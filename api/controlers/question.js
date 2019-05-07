const mongoose = require('mongoose');

const Question = require('../schemas/Question');
const User = require('../schemas/User');

module.exports.getAllQuestions = async (req, res, next) => {

  const questions = await Question.find({topic: req.topicId});

  res.status(200).json(questions.map(question => {
      return {
        id: question.id,
        question: question.question,
        topic: question.topic,
        author: question.author,
        upvotes: question.upvotes
      };
    })
  );

};

module.exports.getQuestionById = async (req, res, next) => {

  const question = await Question.findById(req.params.id );

  if(!question) {
    return res.status(404).json({ message: 'Question not found' });
  }

  res.status(200).json({
    id: question.id,
    question: question.question,
    topic: question.topic,
    author: question.author,
    upvotes: question.upvotes
  });

};

module.exports.upvoteQuestion = async (req, res, next) => {

  const upvoter = await User.findById(req.body.upvoter);

  if(!upvoter) {
    return res.status(404).json({ message: 'User not found' });
  };

  const question = await Question.findById(req.params.id);

  if(!question) {
    return res.status(404).json({ message: 'Question not found' });
  };
  
  if(question.upvotes.includes(upvoter.id)) {
    return res.status(400).json({ message: 'You already upvote this'});
  };

  await question.update({ '$addToSet': { upvotes: req.body.upvoter } }, (err, raw) => {});

  await question.save();

  res.status(200).json({ message: 'Question upvoted' });

};

module.exports.createQuestion = async (req, res, next) => {

  const exist = await Question.findOne({ question: req.body.question });

  if(exist) {
    return res.status(400).json(
      { message: 'Question ' + req.body.question + ' alredy exists' }
      );
  }

  const question = await new Question({
    _id: new mongoose.Types.ObjectId(),
    question: req.body.question,
    author: req.body.author,
    topic: req.topicId
  }).save();

  res.status(201).json({
    id: question.id,
    question: question.question,
    author: question.author,
    topic: question.topic
  });


};