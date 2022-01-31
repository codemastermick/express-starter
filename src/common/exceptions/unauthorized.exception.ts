import HttpException from './http.exception';
import { StatusCodes } from 'http-status-codes';

export default class UnauthenticatedException extends HttpException {
  constructor() {
    super(
      StatusCodes.UNAUTHORIZED,
      'You are not authorized to access this resource. Please try logging in first.'
    );
  }
}
