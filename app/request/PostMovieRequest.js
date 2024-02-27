const Joi = require('joi')

function movieRequest(data) {
  const schema = Joi.object({
    title: Joi.string().required().lowercase(),
    description: Joi.string().required().lowercase(),
    genre: Joi.array().required(),
    director: Joi.string().required().lowercase(),
    releaseDate: Joi.date().required(),
    language: Joi.string().required().lowercase(),
    image: Joi.string().required().lowercase(),
    video: Joi.object({
      url: Joi.string().required(),
      bytes: Joi.number().required(),
      filename: Joi.string().required()
    }).required(),
    rating: Joi.number().min(0).max(10).required(),
    price: Joi.number().required(),
  });

  return schema.validate(data);
}

module.exports = movieRequest;