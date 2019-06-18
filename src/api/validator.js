const Joi = require("joi");

module.exports.userSchema = Joi.object().keys({
  email: Joi.string()
    .email()
    .required(),
  username: Joi.string().required(),
  password: Joi.string().required()
});

module.exports.forgot = Joi.object().keys({
  username: Joi.string().required()
});

module.exports.reset = Joi.object().keys({
  resetCode: Joi.string().required(),
  newPassword: Joi.string().required()
});

module.exports.topicCreation = Joi.object().keys({
  body: Joi.string().required(),
  inviteCode: Joi.string().required()
});

module.exports.topicJoin = Joi.object().keys({
  inviteCode: Joi.string().required()
});

module.exports.question = Joi.object().keys({
  question: Joi.string().required()
});

module.exports.validate = schema => {
  return (req, res, next) => {
    const result = Joi.validate(req.body, schema);
    if (result.error) {
      return res.status(400).json(result.error.details);
    }
    req.body = result.value;
    next();
  };
};
