const conf = require('../config');

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const topicRoutes = require('./routes/topic.js');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const app = express();

mongoose.connect('mongodb+srv://' + conf.MONGODB_ATLAS_USER + ':' + conf.MONGODB_ATLAS_PSW + '@develop-ws0vx.mongodb.net/test?retryWrites=true', { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {

  try {
    next();
  } catch(e) {
    console.error(e);
    res.status(500).end();
  };

});

app.use('/topic', topicRoutes);
app.use('/auth', authRoutes);
app.use('/user', userRoutes);

app.use((req, res, next) => {
  res.status(404).end();
});

app.use((req, res, next) => {
  res.status(500).end();
});

module.exports = app;