import rateLimit from 'express-rate-limit';

export const limitBuilder = (minutes: number, requests: number) => {
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
