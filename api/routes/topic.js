const express = require("express");
const passport = require("passport");

const controler = require("../controlers/topic");
const questionRoutes = require("./question");
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

router.use(
  "/:inviteCode/question",
  (req, res, next) => {
    req.topicCode = req.params.inviteCode;
    next();
  },
  questionRoutes
);

module.exports = router;
