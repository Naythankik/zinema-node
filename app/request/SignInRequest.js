const Joi = require('joi')

function signinRequest(data) {
  const schema = Joi.object({
    email: Joi.string().email().required().lowercase(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(data);
}

module.exports = signinRequest;