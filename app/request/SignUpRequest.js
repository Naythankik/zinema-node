const Joi = require('joi')

function signupRequest(data) {
  const schema = Joi.object({
    first_name: Joi.string().min(2).max(16).required().messages({
      'string.required': `First name is a required field`,
      'string.min': `First name should be more than 2 characters`,
      'string.max': `First name should not be more than 16 characters`
    }),
    last_name: Joi.string().min(2).max(16).required().messages({
      'string.min': `Last name should be more than 2 characters`,
      'string.max': `Last name should not be more than 16 characters`,
      'any.required': `Last name is a required field`
    }),
    telephone: Joi.number().required().messages({
      'number.required' : `Phone number is a required field`
    }),
    email: Joi.string().email().required().lowercase(),
    password: Joi.string().min(6).required(),
    username: Joi.string().alphanum().required().messages({
      'any.required': `Username is a required field`,
      'string.alphanum': `Username should only contain alphanumeric characters`
    })  });

  return schema.validate(data, {abortEarly: false});
}

module.exports = signupRequest;