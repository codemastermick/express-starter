import express from 'express';
import usersService from '../../users/services/users.service';
import * as argon2 from 'argon2';
import { StatusCodes } from 'http-status-codes';
import HttpException from '../../common/exceptions/http.exception';

class AuthMiddleware {
  async verifyUserPassword(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const user: any = await usersService.getUserByEmailWithPassword(
      req.body.email
    );
    if (user) {
      const passwordHash = user.password;
      if (await argon2.verify(passwordHash, req.body.password)) {
        req.body = {
          userId: user._id,
          email: user.email,
          permissionFlags: user.permissionFlags
        };
        return next();
      }
    }
    // Giving the same message in both cases
    // helps protect against cracking attempts:
    throw new HttpException(
      StatusCodes.BAD_REQUEST,
      'Invalid email and/or password'
    );
  }
}

export default new AuthMiddleware();
