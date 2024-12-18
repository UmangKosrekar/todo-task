const rateLimit = require("express-rate-limit");

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100, // 100 requests per IP
  message: "Too many requests from this IP, please try again later.",
  headers: true
});

module.exports = { rateLimiter };
