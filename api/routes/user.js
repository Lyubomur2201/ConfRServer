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

router.put('/reset', controler.resetStart);

router.post('/reset', controler.resetEnd);

module.exports = router;