const express = require('express');

const controler = require('../controlers/question');

const router = express.Router();

router.get('/all', controler.getAllQuestions);

router.get('/:id', controler.getQuestionById);

router.put('/:id', controler.upvoteQuestion);

router.post('/', controler.createQuestion);

module.exports = router;