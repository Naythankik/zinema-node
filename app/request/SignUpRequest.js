const Joi = require('joi')

function signupRequest(data) {
  const schema = Joi.object({
    first_name: Joi.string().min(2).max(16).valid().required(),
    last_name: Joi.string().min(2).max(16).valid().required(),
    telephone: Joi.number().required(),
    email: Joi.string().email().required().lowercase(),
    password: Joi.string().min(6).required(),
    username: Joi.string().required()
  });

  return schema.validate(data);
}

module.exports = signupRequest;