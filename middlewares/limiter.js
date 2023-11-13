const rateLimit =  require("express-rate-limit")

const limiter = rateLimit({
    windowMs: 1000* 60 * 60  ,
    max: 10,
    message: 'Trop de tentative, veuillez essayer ultérieurement',
    headers: true,
});

const loginLimiter = rateLimit({
    max: 10,
    windowMs: 10000,
    message: "Trop de tentative de connexion, veuillez essayer ultérieurement"
})

module.exports = {limiter, loginLimiter}