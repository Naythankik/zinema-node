const express = require("express");
const router = express.Router();

const { createAccount, login, requestVerification, verifyAccount } = require('../../app/controller/AuthController')


router.post('/signup', createAccount);
router.post('/signin', login);
router.post('/request-verification', requestVerification);
router.post('/verifyAccount/:token', verifyAccount);

module.exports = router;