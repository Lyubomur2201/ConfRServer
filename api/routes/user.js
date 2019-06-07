const express = require("express");
const passport = require("passport");

const controler = require("../controlers/user");
const passportConf = require("../passport");
const validator = require("../validator");

const router = express.Router();

router.get(
  "/me",
  passport.authenticate("jwt", { session: false }),
  controler.getMyUser
);

router.get("/:username", controler.getUser);

router.post("/forgot", validator.validate(validator.forgot), controler.forgot);

router.post("/reset", validator.validate(validator.reset), controler.reset);

module.exports = router;
