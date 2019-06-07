const User = require("../database/models/User");
const Topic = require("../database/models/Topic");
const Question = require("../database/models/Question");

module.exports.getAllQuestions = async (req, res, next) => {
  const topic = await Topic.findOne({
    where: { inviteCode: req.topicCode },
    include: [{ model: Question, include: ["Users", User] }]
  });

  if (!topic) return res.status(404).json({ message: "Topic not found" });

  res.status(200).json(
    topic.Questions.map(question => {
      return {
        id: question.id,
        question: question.question,
        author: {
          id: question.User.id,
          username: question.User.username
        },
        upvotes: question.Users.map(user => {
          let { id, username } = user;
          return { id, username };
        })
      };
    })
  );
};

module.exports.getQuestionById = async (req, res, next) => {
  const topic = await Topic.findOne({
    where: { inviteCode: req.topicCode },
    include: [
      {
        model: Question,
        include: ["Users", User]
      }
    ]
  });

  if (!topic) return res.status(404).json({ message: "Topic not found" });

  const question = topic.Questions.find(
    question => question.id == req.params.id
  );

  if (!question) return res.status(404).json({ message: "Question not found" });

  res.status(200).json({
    id: question.id,
    question: question.question,
    author: {
      id: question.User.id,
      username: question.User.username
    },
    upvotes: question.Users.map(user => {
      let { id, username } = user;
      return { id, username };
    })
  });
};

module.exports.upvoteQuestion = async (req, res, next) => {
  const topic = await Topic.findOne({
    where: { inviteCode: req.topicCode },
    include: [
      {
        model: Question,
        include: ["Users", User]
      }
    ]
  });

  if (!topic) return res.status(404).json({ message: "Topic not found" });

  const question = topic.Questions.find(
    question => question.id == req.params.id
  );

  if (!question) return res.status(404).json({ message: "Question not found" });

  if (question.Users.find(user => user.id == req.user.id)) {
    question.removeUsers(req.user);
    return res.status(200).json({ message: "Question unvoted" });
  }

  await question.addUsers(req.user);

  res.status(200).json({ message: "Question upvoted" });
};

module.exports.deleteQuestion = async (req, res, next) => {
  const topic = await Topic.findOne({
    where: { inviteCode: req.topicCode },
    include: [
      { model: Question },
      { model: User, as: "Users", through: { where: { role: "Creator" } } }
    ]
  });

  if (!topic) return res.status(404).json({ message: "Topic not found" });

  if (topic.Users[0].id != req.user.id)
    return res.status(400).json({ message: "You cant edit this topic" });

  const question = topic.Questions.find(
    question => question.id == req.params.id
  );

  if (!question) return res.status(404).json({ message: "Question not found" });

  question.destroy();

  res.status(200).json({ message: "Question successfuly deleted" });
};

module.exports.createQuestion = async (req, res, next) => {
  const topic = await Topic.findOne({
    where: { inviteCode: req.topicCode }
  });

  if (!topic) return res.status(404).json({ message: "Topic not found" });

  const question = await Question.create({
    question: req.body.question
  });

  await topic.addQuestion(question);
  await req.user.addQuestion(question);

  res.status(201).json({ message: "Question successfully created" });
};
