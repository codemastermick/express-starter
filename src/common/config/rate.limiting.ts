import rateLimit from 'express-rate-limit';

const defaultMinutes = 1;
const defaultRequests = 50;

const refreshMinutes = 15;
const refreshRequests = 10;

const limitBuilder = (minutes: number, requests: number) => {
  return rateLimit({
    windowMs: minutes * 60 * 1000,
    max: requests,
    message: `Too many requests, please try again in ${minutes} ${
      minutes > 1 ? 'minutes' : 'minute'
    }`
  });
};

export const defaultLimiter = limitBuilder(defaultMinutes, defaultRequests);
export const refreshLimiter = limitBuilder(refreshMinutes, refreshRequests);
