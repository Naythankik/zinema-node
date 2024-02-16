const Joi = require('joi')

function resetPasswordRequest(data) {
  const schema = Joi.object({
    password: Joi.string().min(6).required(),
    confirm_password: Joi.any().valid(Joi.ref('password')).required().messages({
      'any.only' : 'Password must match'
    }),
  });

  return schema.validate(data);
}

module.exports = resetPasswordRequest;