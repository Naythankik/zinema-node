const express = require("express");
const router = express.Router();

const { createAccount } = require('../../app/controller/AuthController')


router.post('/signup', createAccount);

module.exports = router;