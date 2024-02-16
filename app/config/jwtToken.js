const jwt = require("jsonwebtoken");
const { errorResponse } = require("../Exception/Handler");

const generateToken = (id, time = '1d') => {
  return jwt.sign({userId : id }, process.env.JWT_SECRET, { expiresIn: time });
};

const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET, (error) => {
      return !error;
    });
}

module.exports = { 
  generateToken,
  verifyToken
 };