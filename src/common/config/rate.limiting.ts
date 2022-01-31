import rateLimit from 'express-rate-limit';

const defaultLimitMinutes = 1;
const defaultLimitRequests = 50;

const refreshLimitMinutes = 15;
const refreshLimitRequests = 10;

const limitBuilder = (minutes: number, requests: number) => {
  return rateLimit({
    windowMs: minutes * 60 * 1000,
    max: requests,
    message: `Too many requests, please try again in ${minutes} ${
      minutes > 1 ? 'minutes' : 'minute'
    }`
  });
};

export const defaultRateLimit = limitBuilder(
  defaultLimitMinutes,
  defaultLimitRequests
);
export const refreshTokenLimiter = limitBuilder(
  refreshLimitMinutes,
  refreshLimitRequests
);
