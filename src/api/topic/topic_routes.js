const express = require("express");
const passport = require("passport");

const controler = require("./topic_controler");
const passportConf = require("../passport");
const validator = require("../validator");

const router = express.Router();

router.get("/:inviteCode", controler.getTopicByInviteCode);

router.delete(
  "/:inviteCode",
  passport.authenticate("jwt", { session: false }),
  controler.deleteTopic
);

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  validator.validate(validator.topicCreation),
  controler.createTopic
);

router.post(
  "/join",
  passport.authenticate("jwt", { session: false }),
  validator.validate(validator.topicJoin),
  controler.joinTopic
);

router.get("/:inviteCode/question", controler.getAllQuestions);

router.post(
  "/:inviteCode/question",
  passport.authenticate("jwt", { session: false }),
  validator.validate(validator.question),
  controler.createQuestion
);

module.exports = router;
