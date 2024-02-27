const { signupRequest, signinRequest, verificationRequest, resetPasswordRequest } = require('../request');
const User = require('../model/User')
const { ModelCollectionExist, successResponseWithData, successResponse, errorResponse } = require('../Exception/Handler')
const { mail } = require('../config/mailer')
const { generateToken, verifyToken } = require('../config/jwtToken');
const cryptoJS = require('crypto-js')
const bcrypt = require("bcrypt");

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

        await mail(newUser.email, subject, 'User Successfully Created', `${process.env.APP_URL}/auth/verify/${token}}`, 'Verify Account')
      }
    } catch (error) {
      await User.findByIdAndDelete(user.id);
      return errorResponse(res, error.message, error.status);
    }

    return successResponseWithData(res, user, 'Verfication Mail has been sent to email!!!', 201);
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
        await User.findByIdAndUpdate(decodedToken.userId, {
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

  updateUser.password = undefined

  return successResponseWithData(res, updateUser, '');
};

const verifyAccount = async (req, res) => {
  const { token } = req.params;

  const findToken = await User.findOne({'token': token});

  if(findToken === null){
    return errorResponse(res, 'Token is invalid, send a new request or check your mail if you sent a requet in the last 10 mins');
  }

  if(findToken?.status !== 'pending'){
    return errorResponse(res, 'User account is verified already');
  }

  if (!verifyToken(token)){
    return errorResponse(res, 'Token has expired, request for a new one');
  }

  findToken.status = 'approved'
  findToken.token = null;

  await findToken.save();

  return successResponseWithData(res, findToken, 'User has been verified successfully!');
}

const requestVerification = async (req, res) => {
  const {error, value} = verificationRequest(req.body);

  if(error){
    return errorResponse(res, error.details[0].message, 422);
  }

  const user = await User.findOne(value);

  if(!user){
    return errorResponse(res, 'User not found');
  }

  if(user.status !== 'pending'){
    return errorResponse(res, 'User account is verified already');
  }

  if(user.token && verifyToken(res, user.token)){
      return errorResponse(res, 'Token is still active, check your email')
  }

  const newToken = generateToken(user.id, '10m');

  await mail(user.email, subject, 'Email Verification', `${process.env.APP_URL}/auth/verify/${newToken}}`, 'Verify Account')

  user.token = newToken;

  await user.save();

  return successResponse(res,'A new email verification has been sent to your email');
}

const forgetPassword = async (req, res) => {
  const {error, value} = verificationRequest(req.body);

  if(error){
    return errorResponse(res, error.details[0].message, 422);
  }

    const user = await User.findOne(value);

    if(!user){
      return errorResponse(res, 'User not found');
    }

    if(user.passwordResetToken){
      if((user.passwordResetExpires - Date.now()) > 0){
        return errorResponse(res, 'Password reset link still active')
      }
    }

    const token = cryptoJS.AES.encrypt(user.email, process.env.JWT_SECRET).toString().replaceAll('/', 'zi');

    await User.findByIdAndUpdate(user.id, {
      $set: {
        passwordResetToken : token,
        passwordResetExpires: Date.now() + (1000 * 60 *10)
        },
    });

    subject = 'Forget Password'

    const text = `A mail has been sent to you <br> <a href=${process.env.APP_URL}/auth/reset-password/${token}}>Reset Password</a>`


    await mail(user.email, subject, text, `${process.env.APP_URL}/auth/reset-password/${token}}`, 'Reset Password');


    return successResponse(res,'Verification Mail has been sent to email!!!', 201);
}

const resetPassword = async (req, res) => {
  const { error, value } = resetPasswordRequest(req.body);

  if(error){
    return errorResponse(res, error.details[0].message);
  }

  const { token } = req.params;

  let decryptToken = cryptoJS.AES.decrypt(token.replaceAll('zi', '/'), process.env.JWT_SECRET).toString(cryptoJS.enc.Utf8);

  if(decryptToken.length === 0){
    return errorResponse(res, 'Token is invalid');
  }

  const user = await User.findOne({ passwordResetToken : token});

  if(!user){
    return errorResponse(res, 'User not found');
  }

  if(decryptToken !== user.email){
    return errorResponse(res, 'Token is invalid for the user', 442);
  }

  const salt = await bcrypt.genSalt(10);

  await User.findByIdAndUpdate(user.id, {
    $set: {
      passwordResetToken : null,
      passwordResetExpires : null,
      passwordChangedAt: Date.now(),
      password : await bcrypt.hash(value.password, salt)
    },
  });

  subject = 'Reset Password'

  const text = `Password has been reset successfully`

  await mail(user.email, subject, text, '#', 'Reset Password');

  return successResponse(res,'Password has been reset successfully!!!', 201);
}

module.exports = {
  createAccount,
  login,
  requestVerification,
  verifyAccount,
  forgetPassword,
  resetPassword
};