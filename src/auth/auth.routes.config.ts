import { CommonRoutesConfig } from '../common/common.routes.config';
import authController from './controllers/auth.controller';
import authMiddleware from './middleware/auth.middleware';
import express from 'express';
import BodyValidationMiddleware from '../common/middleware/body.validation.middleware';
import { body } from 'express-validator';
import jwtMiddleware from './middleware/jwt.middleware';
// import rateLimit from 'express-rate-limit';

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 10, // limit each IP to 10 requests per windowMs
//   message: 'Too many requests, please try again after 15 minutes',
//   // this above message is shown to user when max requests is exceeded
// });

export class AuthRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, 'AuthRoutes');
  }

  configureRoutes(): express.Application {
    this.app.post(`/auth`, [
      body('email').isEmail(),
      body('password').isString(),
      BodyValidationMiddleware.verifyBodyFieldsErrors,
      authMiddleware.verifyUserPassword,
      authController.createJWT
    ]);

    this.app.post(`/auth/refresh-token`, [
      //TODO block request if token refreshed too recently - some kind of rate limiting
      // limiter,
      jwtMiddleware.validJWTNeeded,
      jwtMiddleware.verifyRefreshBodyField,
      jwtMiddleware.validRefreshNeeded,
      authController.createJWT
      //TODO invalidate old tokens
    ]);

    return this.app;
  }
}
