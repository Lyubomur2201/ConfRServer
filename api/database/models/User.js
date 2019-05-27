const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");

const sequelize = require("../index");

class User extends Sequelize.Model {}

User.init(
  {
    username: {
      type: Sequelize.STRING,
      unique: true
    },
    email: {
      type: Sequelize.STRING,
      allowNull: true
    },
    password: {
      type: Sequelize.STRING,
      allowNull: true
    },
    google: {
      type: Sequelize.STRING,
      allowNull: true
    },
    facebook: {
      type: Sequelize.STRING,
      allowNull: true
    },
    telegram: {
      type: Sequelize.STRING,
      allowNull: true
    },
    isActive: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    resetCode: {
      type: Sequelize.STRING,
      allowNull: true
    },
    verificationCode: {
      type: Sequelize.STRING,
      allowNull: true
    }
  },
  {
    hooks: {
      beforeCreate: (user, options) => {
        if (user.password) {
          const hash = bcrypt.hashSync(user.password, 10);
          user.password = hash;
        }
      },
      beforeUpdate: (user, options) => {
        if (options.passwordReset) {
          const hash = bcrypt.hashSync(user.password, 10);
          user.resetCode = null;
          user.password = hash;
        }
      }
    },
    sequelize,
    modelName: "User"
  }
);

module.exports = User;
