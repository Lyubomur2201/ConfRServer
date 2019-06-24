const User = require("../user/user_model");
const Topic = require("../topic/topic_model");

module.exports.getUser = async userID => {
  let { id, username, email } = await User.findOne({ where: { id: userID } });
  return {
    id,
    username,
    email,
    topics: async () => await this.getUserTopics(id)
  };
};

module.exports.getUserTopics = async userID => {
  let { Topics } = await User.findOne({
    where: { id: userID },
    include: "Topics"
  });

  return Topics.map(topic => {
    let { id, body, inviteCode, TopicRole } = topic;
    console.log(TopicRole.role);

    return {
      id,
      body,
      inviteCode,
      members: async () => {
        return await getTopicMembers(id);
        return Users.map(async user => await getUser(user));
      },
      creator: async () => {
        return await getTopicCreator(id);
      }
    };
  });
};

module.exports.getTopicMembers = TopicID => {
  
}
