const Topic = require("../database/models/Topic");
const User = require("../database/models/User");
const Question = require("../database/models/Question");

module.exports.getTopicByInviteCode = async (req, res, next) => {
  const topic = await Topic.findOne({
    where: { inviteCode: req.params.inviteCode },
    include: "Users"
  });

  if (!topic) return res.status(404).json({ message: "Topic not found" });

  const creator = topic.Users.find(user => user.TopicRole.role == "Creator");

  res.status(200).json({
    body: topic.body,
    inviteCode: topic.inviteCode,
    members: topic.Users.map(user => {
      return {
        id: user.id,
        username: user.username,
        topicRole: user.TopicRole.role
      };
    }),
    creator: {
      id: creator.id,
      username: creator.username,
      topicRole: creator.TopicRole.role
    }
  });
};

module.exports.deleteTopic = async (req, res, next) => {
  const topic = await Topic.findOne({
    where: { inviteCode: req.params.inviteCode },
    include: [
      { model: User, as: "Users", through: { where: { role: "Creator" } } }
    ]
  });

  if (!topic) return res.status(404).json({ message: "Topic not found" });

  if (topic.Users[0].id != req.user.id)
    return res.status(400).json({ message: "You cant edit this topic" });

  await topic.destroy();

  res.status(200).json({ message: "Topic successfuly deleted" });
};

module.exports.joinTopic = async (req, res, next) => {
  const topic = await Topic.findOne({
    where: { inviteCode: req.body.inviteCode },
    include: "Users"
  });

  if (!topic) return res.status(404).json({ message: "Topic not found" });

  if (
    topic.Users == req.user ||
    topic.Users.map(user => user.id).includes(req.user.id)
  )
    return res.status(400).json({
      message: "You already joined this topic"
    });

  await topic.addUser(req.user, { through: { role: "Member" } });

  res.status(200).json({ message: "You joined the topic" });
};

module.exports.createTopic = async (req, res, next) => {
  const exist = await Topic.findOne({
    where: { inviteCode: req.body.inviteCode }
  });

  if (exist)
    return res.status(400).json({
      message: "Topic " + req.body.inviteCode + " alredy exists"
    });

  const topic = await Topic.create({
    body: req.body.body,
    inviteCode: req.body.inviteCode
  });
  topic.addUser(req.user, { through: { role: "Creator" } });

  res.status(201).json({ message: "Topic successfully created" });
};

module.exports.getAllQuestions = async (req, res, next) => {
  const topic = await Topic.findOne({
    where: { inviteCode: req.params.inviteCode },
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

module.exports.createQuestion = async (req, res, next) => {
  const topic = await Topic.findOne({
    where: { inviteCode: req.params.inviteCode }
  });

  if (!topic) return res.status(404).json({ message: "Topic not found" });

  const question = await Question.create({
    question: req.body.question
  });

  await topic.addQuestion(question);
  await req.user.addQuestion(question);

  res.status(201).json({ message: "Question successfully created" });
};
