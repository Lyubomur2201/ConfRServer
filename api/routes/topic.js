const express = require('express');
const passport = require('passport');

const controler = require('../controlers/topic');
const questionRoutes = require('./question');
const passportConf = require('../passport');

const router = express.Router();

router.get('/:inviteCode', controler.getTopicByInviteCode);

router.delete('/:inviteCode', 
  passport.authenticate('jwt', { session: false }),
  controler.deleteTopic
);

router.post('/',
  passport.authenticate('jwt', { session: false }),
  controler.createTopic
);

router.post('/join',
  passport.authenticate('jwt', { session: false }),
  controler.joinTopic
);

router.use('/:inviteCode/question', (req, res, next) => {
  req.topicCode = req.params.inviteCode;
  next();
}, questionRoutes);

module.exports = router;