const express = require('express');
const router = express.Router();
const passport = require('passport');

const passportCongif = require('../passport');
const controler = require('../controlers/auth');
const validator = require('../validator');

router.post('/signup',
            validator.validate(validator.userSchema),
            controler.signup);

router.post('/signin',
            passport.authenticate('local', {session: false}),
            controler.signin);

router.post('/google',
            passport.authenticate('google', {session: false}),
            controler.google);
            
router.post('/facebook',
            passport.authenticate('facebook', {session: false}),
            controler.facebook);

router.post('/verify', controler.verify);

module.exports = router;