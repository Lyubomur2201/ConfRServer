const express = require('express');

const controler = require('../controlers/topic');
const questionRoutes = require('./question');

const router = express.Router();

router.get('/all', controler.getAllTopics);

router.get('/:id', controler.getTopicById);

router.post('/', controler.createTopic);

router.use('/:topicId/question', (req, res, next) => {
  req.topicId = req.params.topicId;
  next();
}, questionRoutes);

module.exports = router;