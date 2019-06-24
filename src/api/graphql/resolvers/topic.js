const Topic = require("../../topic/topic_model");
const User = require("../../user/user_model");

const { getUser } = require("../utils");

module.exports.createTopic = async options => {
  return ["Hello"];
};

module.exports.topic = async opt => {
  let { id, body, inviteCode, Users } = await Topic.findOne({
    where: { id: opt.id },
    include: [
      {
        model: User,
        as: "Users"
      }
    ]
  });

  return {
    id,
    body,
    inviteCode,
    members: async () => {
      return Users.map(async user => await getUser(user));
    },
    creator: async () => {
      return await getUser(
        Users.find(user => user.TopicRole.role == "Creator")
      );
    }
  };
};
