const Joi = require('joi')

function verificationRequest(data) {
  const schema = Joi.object({
    email: Joi.string().email().required().lowercase(),
  });

  return schema.validate(data);
}

module.exports = verificationRequest;