const Sequelize = require("sequelize");

const sequelize = require("../index");
const User = require("./User");
const Topic = require("./Topic");

class Question extends Sequelize.Model {}
class Upvote extends Sequelize.Model {}

Question.init(
  {
    question: {
      type: Sequelize.STRING(1000)
    }
  },
  {
    sequelize,
    modelName: "Question"
  }
);

Upvote.init(
  {},
  {
    sequelize,
    modelName: "Upvote"
  }
);

User.belongsToMany(Question, {
  as: "Upvotes",
  through: Upvote
});

Question.belongsToMany(User, {
  as: "Users",
  through: Upvote
});

Topic.hasMany(Question);
Question.belongsTo(Topic);

User.hasMany(Question);
Question.belongsTo(User);

module.exports = Question;
