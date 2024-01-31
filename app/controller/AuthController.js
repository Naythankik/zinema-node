const validateSignUp = require('../request/SignUpRequest');
const User = require('../model/User')
const { ModelCollectionExist, successResponse } = require('../Exception/Handler')
const { main } = require('../config/mailer')

const createAccount = async (req, res) => {
    const {error, value} = validateSignUp(req.body);

    if(error){
      return res.status(422).send({
        success: false,
        error: error.details[0].message,
      });
    }else if(await ModelCollectionExist(User, {'email': value.email})){
      return res.json({
        success: false,
        message: "Email has been used already"
      });
    }else if(await ModelCollectionExist(User, {'telephone': value.telephone})){
      return res.json({
        success: false,
        message: "Telephone has been used already"
      })
    }else if(await ModelCollectionExist(User, {'username': value.username})){
      return res.json({
        success: false,
        message: "Username has been used already"
      });
    }

    const newUser = await User.create(value);

    if(newUser){
      let subject = 'Welcome to Zinema'
      subject += ''
      await main(newUser.email, 'User Successfully Created', subject)
    }

    return res.json(successResponse(newUser, 'User created successfully'));
};

module.exports = {
  createAccount
};