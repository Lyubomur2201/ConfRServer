const pg = require('pg');
const Sequelize = require('sequelize');

pg.defaults.ssl = true;
module.exports = new Sequelize(process.env.POSTGRES_DB, process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
  host: 'ec2-54-247-85-251.eu-west-1.compute.amazonaws.com',
  dialect: 'postgres',
  logging: false
});