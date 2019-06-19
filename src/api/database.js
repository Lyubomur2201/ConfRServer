const pg = require("pg");
const Sequelize = require("sequelize");

pg.defaults.ssl = true;
module.exports = new Sequelize(
  process.env.NODE_ENV == "TEST"
    ? process.env.POSTGRES_TEST_DB
    : process.env.POSTGRES_DB,
  process.env.NODE_ENV == "TEST"
    ? process.env.POSTGRES_TEST_USER
    : process.env.POSTGRES_USER,
  process.env.NODE_ENV == "TEST"
    ? process.env.POSTGRES_TEST_PASSWORD
    : process.env.POSTGRES_PASSWORD,
  {
    host:
      process.env.NODE_ENV == "TEST"
        ? process.env.POSTGRES_TEST_HOST
        : process.env.POSTGRES_HOST,
    dialect: "postgres",
    logging: false
  }
);
