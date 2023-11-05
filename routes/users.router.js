const express = require('express')
const router = express.Router()
const userCtrl = require('../controllers/user.controller')
const helmet = require("helmet")
const {limiter, loginLimiter} = require('../middlewares/limiter');

router.post('/login',helmet(),loginLimiter, userCtrl.login)

router.use(limiter);

router.post('/signup',helmet(),userCtrl.signup)

module.exports = router