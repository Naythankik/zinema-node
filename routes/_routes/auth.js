const express = require("express");
const router = express.Router();

const { createAccount, login, requestVerification, verifyAccount, forgetPassword, resetPassword } = require('../../app/controller/AuthController')


router.post('/signup', createAccount);
router.post('/signin', login);
router.post('/request-verification', requestVerification);
router.post('/verifyAccount/:token', verifyAccount);
router.post('/forget-password', forgetPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;