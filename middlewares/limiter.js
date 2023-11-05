const rateLimit =  require("express-rate-limit")

 const limiter = rateLimit({
    windowMs: 1000, // 24 hrs in milliseconds
    max: 5,
    message: 'You have exceeded the 100 requests in 24 hrs limit!',
    headers: true,
});

const loginLimiter = rateLimit({
    max: 3,
    windowMs: 10000,
    message: "Too many login attemps, Try again later"
})

module.exports = {limiter, loginLimiter}