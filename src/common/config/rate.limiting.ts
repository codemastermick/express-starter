import rateLimit from 'express-rate-limit';

const defaultMinutes = 1;
const defaultRequests = 50;

const refreshMinutes = 15;
const refreshRequests = 10;

const limitBuilder = (minutes: number, requests: number) => {
  const m = minutes >= 1 ? minutes : 1;
  const r = requests >= 1 ? requests : 1;
  return rateLimit({
    windowMs: m * 60 * 1000,
    max: r,
    message: `Too many requests, please try again in ${m} ${
      m > 1 ? 'minutes' : 'minute'
    }`
  });
};

export const defaultLimiter = limitBuilder(defaultMinutes, defaultRequests);
export const refreshLimiter = limitBuilder(refreshMinutes, refreshRequests);
