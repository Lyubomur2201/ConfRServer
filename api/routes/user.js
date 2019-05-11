const express = require('express');
const passport = require('passport');

const controler = require('../controlers/user');
const passportConf = require('../passport');

const router = express.Router();

router.get('/me',
  passport.authenticate('jwt', { session: false }),
  controler.getMyUser
);

router.get('/:username', controler.getUser);

router.post('/forgot', controler.forgot);

router.post('/reset', controler.reset);

module.exports = router;