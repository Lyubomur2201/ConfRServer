const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const sequelize = require('./database');
const topicRoutes = require('./routes/topic.js');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

const app = express();

sequelize
  .authenticate()
  .then(() => {
    sequelize.sync();
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {

  try {
    next();
  } catch(e) {
    console.error(e);
    res.status(500).json({message: 'Server Error'});
  };

});

app.use('/topic', topicRoutes);
app.use('/auth', authRoutes);
app.use('/user', userRoutes);

app.use((req, res, next) => {
  res.status(404).json({message: 'Route not found'});
});

app.use((req, res, next) => {
  res.status(500).json({message: 'Server Error'});
});

module.exports = app;