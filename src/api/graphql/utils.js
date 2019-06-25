const User = require("../user/user_model");
const Topic = require("../topic/topic_model");
const Question = require("../question/question_model");

module.exports.getUser = async userID => {
  let user = await User.findOne({ where: { id: userID } });
  if (!user) {
    return null;
  }
  let { id, username, email } = user;

  return {
    id,
    username,
    email,
    topics: async () => await this.getUserTopics(id)
  };
};

module.exports.getUserTopics = async userID => {
  let user = await User.findOne({
    where: { id: userID },
    include: "Topics"
  });

  if (!user) {
    return null;
  }

  let { Topics } = user;

  if (!Topics) {
    return null;
  }

  return Topics.map(topic => {
    let { id, body, inviteCode } = topic;

    return {
      id,
      body,
      inviteCode,
      members: async () => await this.getTopicMembers(id),
      creator: async () => await this.getTopicCreator(id),
      questions: async () => await this.getTopicQuestions(id)
    };
  });
};

module.exports.getTopicMembers = async topicID => {
  let topic = await Topic.findOne({
    where: { id: topicID },
    include: "Users"
  });

  if (!topic) {
    return null;
  }
  let { Users } = topic;
  if (!Users) {
    return null;
  }
  return Users.map(({ id, username, email }) => {
    return {
      id,
      username,
      email,
      topics: async () => await this.getUserTopics(id)
    };
  });
};

module.exports.getTopicCreator = async topicID => {
  let topic = await Topic.findOne({
    where: { id: topicID },
    include: [
      { model: User, as: "Users", through: { where: { role: "Creator" } } }
    ]
  });

  if (!topic) {
    return null;
  }

  let { Users } = topic;
  if (!Users) {
    return null;
  }
  let { id, username, email } = Users[0];
  return {
    id,
    username,
    email,
    topics: async () => await this.getUserTopics(id)
  };
};

module.exports.getTopicQuestions = async topicID => {
  let topic = await Topic.findOne({
    where: { id: topicID },
    include: [{ model: Question, include: ["Users", User] }]
  });
  if (!topic) {
    return null;
  }
  
  let { Questions } = topic;

  if (Questions.length == 0) {
    
    return null;
  }

  return Questions.map(({ id, question, User, Users }) => {
    
    return {
      id,
      question,
      author: async () => await this.getUser(User.id),
      upvotes: () =>
        Users.map(({ id, username, email }) => {
          return {
            id,
            username,
            email,
            topics: async () => await this.getUserTopics(id)
          };
        })
    };
  });
};
