const express = require('express');

const controler = require('../controlers/user');
const validator = require('../validator');

const router = express.Router();

router.get('/all', controler.getAllUsers);

router.get('/:email', controler.getUserByEmail);

router.post('/', validator.validate(validator.userSchema), controler.createUser);

module.exports = router;