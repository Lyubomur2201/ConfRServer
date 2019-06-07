const express = require("express");
const passport = require("passport");

const controler = require("../controlers/question");
const passportConf = require("../passport");
const validator = require("../validator");

const router = express.Router();

router.get("/", controler.getAllQuestions);

router.get("/:id", controler.getQuestionById);

router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  controler.upvoteQuestion
);

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  controler.deleteQuestion
);

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  validator.validate(validator.question),
  controler.createQuestion
);

module.exports = router;
