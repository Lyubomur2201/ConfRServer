const express = require("express");
const router = express.Router();
const passport = require("passport");

const passportCongif = require("../passport");
const controler = require("./auth_controler");
const validator = require("../validator");

router.post(
  "/signup",
  validator.validate(validator.userSchema),
  controler.signup
);

router.post(
  "/signin",
  passport.authenticate("local", { session: false }),
  controler.generateToken
);

router.post(
  "/google",
  passport.authenticate("google", { session: false }),
  controler.generateToken
);

router.post(
  "/facebook",
  passport.authenticate("facebook", { session: false }),
  controler.generateToken
);

router.post("/verify", controler.verify);

module.exports = router;
