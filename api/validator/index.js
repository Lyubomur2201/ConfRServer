const Joi = require("joi");

module.exports.userSchema = Joi.object().keys({
  email: Joi.string()
    .email()
    .required(),
  username: Joi.string().required(),
  password: Joi.string().required()
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
