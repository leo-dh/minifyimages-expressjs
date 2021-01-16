import rateLimit from 'express-rate-limit';

const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hr
  max: 20,
  message: 'Too many requests made from this IP, please try again in an hour.',
});

export { apiLimiter };
