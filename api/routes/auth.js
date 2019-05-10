const express = require('express');
const router = express.Router();
const passport = require('passport');

const passportCongif = require('../passport');
const routes = require('../controlers/auth');
const validator = require('../validator');

router.post('/signup',
            validator.validate(validator.userSchema),
            routes.signup);

router.post('/signin',
            passport.authenticate('local', {session: false}),
            routes.signin);

router.post('/google',
            passport.authenticate('google', {session: false}),
            routes.google);
            
router.post('/facebook',
            passport.authenticate('facebook', {session: false}),
            routes.facebook);

router.post('/reset',
            passport.authenticate('jwt', {session: false}),
            routes.reset);


router.post('/verify', routes.verify);

module.exports = router;