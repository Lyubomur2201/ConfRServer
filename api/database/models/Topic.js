const Sequelize = require("sequelize");

const sequelize = require("../index");
const User = require("./User");

class Topic extends Sequelize.Model {}
class TopicRole extends Sequelize.Model {}

Topic.init(
  {
    inviteCode: {
      type: Sequelize.STRING,
      unique: true
    },
    body: {
      type: Sequelize.STRING(1000)
    }
  },
  {
    sequelize,
    modelName: "Topic"
  }
);

TopicRole.init(
  {
    role: Sequelize.STRING
  },
  {
    sequelize,
    modelName: "TopicRole"
  }
);

User.belongsToMany(Topic, {
  as: "Topics",
  through: TopicRole
});
Topic.belongsToMany(User, {
  as: "Users",
  through: TopicRole
});

module.exports = Topic;
