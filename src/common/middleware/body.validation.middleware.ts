import express from 'express';
import { validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import HttpException from '../exceptions/http.exception';

class BodyValidationMiddleware {
  verifyBodyFieldsErrors(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const errors = validationResult(req);
    let msg = '';
    for (let i = 0; i < errors.array().length; i++) {
      msg += JSON.stringify(errors.array()[i]);
    }
    if (!errors.isEmpty()) {
      throw new HttpException(StatusCodes.BAD_REQUEST, msg);
    }
    next();
  }
}

export default new BodyValidationMiddleware();
