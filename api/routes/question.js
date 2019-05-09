const express = require('express');
const passport = require('passport');

const controler = require('../controlers/question');
const passportConf = require('../passport');

const router = express.Router();

router.get('/', controler.getAllQuestions);

router.get('/:id', controler.getQuestionById);

router.put('/:id',
  passport.authenticate('jwt', { session: false }),
  controler.upvoteQuestion
);

router.post('/',
  passport.authenticate('jwt', { session: false }),
  controler.createQuestion
);

module.exports = router;