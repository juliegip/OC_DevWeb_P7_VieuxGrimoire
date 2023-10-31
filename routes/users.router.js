const express = require('express')
const router = express.Router()
const userCtrl = require('../controllers/user.controller')
const helmet = require("helmet")


router.post('/signup',helmet(),userCtrl.signup)
router.post('/login',helmet(), userCtrl.login)

module.exports = router