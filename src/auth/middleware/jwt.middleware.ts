import express from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Jwt } from '../../common/types/jwt';
import { StatusCodes } from 'http-status-codes';
import usersService from '../../users/services/users.service';
import UnauthenticatedException from '../../common/exceptions/unauthorized.exception';

const JWT_SECRET = process.env.JWT_SECRET as string;

class JwtMiddleware {
  verifyRefreshBodyField(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (req.body && req.body.refreshToken) {
      return next();
    } else {
      return res
        .status(400)
        .send({ errors: ['Missing required field: refreshToken'] });
    }
  }

  async validRefreshNeeded(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const user: any = await usersService.getUserByEmailWithPassword(
      res.locals.jwt.email
    );
    const salt = crypto.createSecretKey(
      Buffer.from(res.locals.jwt.refreshKey.data)
    );
    const hash = crypto
      .createHmac('sha512', salt)
      .update(res.locals.jwt.userId + JWT_SECRET)
      .digest('base64');
    if (hash === req.body.refreshToken) {
      req.body = {
        userId: user._id,
        email: user.email,
        permissionFlags: user.permissionFlags
      };
      return next();
    } else {
      return res.status(400).send({ errors: ['Invalid refresh token'] });
    }
  }

  validJWTNeeded(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (req.headers['authorization']) {
      try {
        const authorization = req.headers['authorization'].split(' ');
        if (authorization[0] !== 'Bearer') {
          throw new UnauthenticatedException();
        } else {
          //TODO this is where the refresh token should be invalidated
          res.locals.jwt = jwt.verify(authorization[1], JWT_SECRET) as Jwt;
          next();
        }
      } catch (err) {
        //TODO add forbidden exception here
        console.log(err);
        return res.status(StatusCodes.FORBIDDEN).send();
      }
    } else {
      throw new UnauthenticatedException();
    }
  }
}

export default new JwtMiddleware();
