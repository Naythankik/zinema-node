const jwt = require("jsonwebtoken");
const { errorResponse } = require("../Exception/Handler");

const generateToken = (id, time = '1d') => {
  return jwt.sign({userId : id }, process.env.JWT_SECRET, { expiresIn: time });
};

const verifyToken = (res, token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return errorResponse(res, 'Token has expired, request for a new token.');
  }
}

module.exports = { 
  generateToken,
  verifyToken
 };