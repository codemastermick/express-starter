import HttpException from './http.exception';

export default class ResourceUnavailableException extends HttpException {
  constructor(uri: string) {
    super(404, `Could not access the resource at ${uri}.`);
  }
}
