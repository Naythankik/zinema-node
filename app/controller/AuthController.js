const { signuprequest, signinRequest, verificationRequest } = require('../request');
const User = require('../model/User')
const { ModelCollectionExist, successResponse, errorResponse } = require('../Exception/Handler')
const { mail } = require('../config/mailer')
const { generateToken, verifyToken } = require('../config/jwtToken');
const signupRequest = require('../request/SignUpRequest');

let subject = 'Welcome to Zinema';


const createAccount = async (req, res) => {
    const {error, value} = signupRequest(req.body);
    
    if(error){
      return errorResponse(res, error.details[0].message, 422);
    }else if(await ModelCollectionExist(User, {'email': value.email})){
      return errorResponse(res, 'Email has been used already', 422);
    }else if(await ModelCollectionExist(User, {'telephone': value.telephone})){
      return errorResponse(res, 'Telephone has been used already', 422);
    }else if(await ModelCollectionExist(User, {'username': value.username})){
      return errorResponse(res, 'Username has been used already', 422);
    }

    let user = '';

    try {
      const newUser = user = await User.create(value);

      if(newUser){
        const token = generateToken(newUser.id, '10m');

        await User.findByIdAndUpdate(newUser.id, {
          $set: { token },
        });

        user.token = token;
        user.password = user.__v = undefined;

        await mail(newUser.email, 'User Successfully Created', subject, token)
      }
    } catch (error) {
      await User.findByIdAndDelete(user.id);
      return errorResponse(res, error.message, error.status);
    }

    return successResponse(res, user, 'Verfication Mail has been sent to email!!!', 201);
};

const login = async (req, res) => {
  const {error, value} = signinRequest(req.body);

  if(error){
    return errorResponse(res, error.details[0].message, 422);
  }

  const user = await User.findOne({'email' : value.email});

  if(!user){
    return errorResponse(res, 'User not found', 404);
  }

  const verifyPassword = await user.comparePassword(value.password);

  if(!verifyPassword){
    return errorResponse(res, 'Incorrect password, try again', 401);
  }

  if(user.status !== 'approved'){
    return errorResponse(res, 'Account has not been verified, check mail for verification token', 401);
  }

  if (req.headers.authorization) {
    const existingToken = req.headers.authorization.substring(7);

    if (existingToken) {
      const decodedToken = jwt.verify(existingToken, jwtSecret);

      /**if the new user is different from the currently login user */
      if (decodedToken.userId !== user._id) {
        // update the current login user isActive status to false
        const usersa = await User.findByIdAndUpdate(decodedToken.userId, {
          $set: {
            isActive: false,
          },
        });
      }
    }
  }

  const token = await generateToken(user.id, '1hr')

  const updateUser = await User.findByIdAndUpdate(
    user._id,
    {
      token,
      isActive : true
    },
    { new: true }
  );

  updateUser.password = updateUser.token = undefined

  return successResponse(res, updateUser, '');
};

const verifyAccount = async (req, res) => {
  const { token } = req.params;

  const findToken = await User.findOne({'token': token});

  if(findToken.status !== 'pending'){
    return errorResponse(res, 'User account is verified already');
  }

  if(!findToken){
    return errorResponse(res, 'Token is invalid, send a new request or check your mail if you sent a requet in the last 10 mins');
  }

  $tokenVerification = verifyToken(res, token);

  findToken.status = 'approved'

  await findToken.save();

  return successResponse(res, findToken, 'User has been verified successfully!');
}

const requestVerification = async (req, res) => {
  const {error, value} = verificationRequest(req.body);

  if(error){
    return errorResponse(res, error.details[0].message, 422);
  }

  const user = await User.findOne({'email' : value.email});

  if(!user){
    return errorResponse(res, 'User not found');
  }

  if(user.status !== 'pending'){
    return errorResponse(res, 'User account is verified already');
  }

  if(user.token){
    if(verifyToken(res, user.token).userId){
      return errorResponse(res, 'Token is still active, check your email')
    }
  }

  const newToken = generateToken(user.id, '10m');

  await mail(user.email, 'Email Verification', subject, newToken)

  user.token = newToken;

  await user.save();

  return successResponse(res, [], 'A new email verification has been sent to your email');
}

module.exports = {
  createAccount,
  login,
  requestVerification,
  verifyAccount
};