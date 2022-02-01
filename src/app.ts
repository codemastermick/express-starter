import dotenv from 'dotenv-safe';
try {
  dotenv.config({
    example: '.env.example'
  });
} catch (error) {
  throw error;
}

import express from 'express';
import * as http from 'http';
import cors from 'cors';
import { CommonRoutesConfig } from './common/common.routes.config';
import { UsersRoutes } from './users/users.routes.config';
import { AuthRoutes } from './auth/auth.routes.config';
import helmet from 'helmet';
import morganMiddleware from './common/middleware/morgan.middleware';
import Logger from './common/services/logger.service';
import errorHandler from './common/middleware/error.handler.middleware';
import mongooseService from './common/services/mongoose.service';
import { limitBuilder } from './common/middleware/rate.limiting.middleware';
import ResourceUnavailableException from './common/exceptions/resource.unavailable.exception';

const APP_NAME = process.env.APP_NAME as string;
const PORT = process.env.PORT as string;

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const routes: Array<CommonRoutesConfig> = [];
const logger: Logger = new Logger(APP_NAME);

// here we are adding middleware to parse all incoming requests as JSON
app.use(express.json());

// here we are adding middleware to allow cross-origin requests
app.use(cors());
// the helmet middleware is a collection of settings for http server security
app.use(helmet());
// this is our custom logging middleware
app.use(morganMiddleware);
// this applies rate limiting to the whole app
app.use(limitBuilder(1, 50));
// here we are adding the UserRoutes to our array,
// after sending the Express.js application object to have the routes added to our app!
routes.push(new UsersRoutes(app));
// now we add the auth routes the same way as above
routes.push(new AuthRoutes(app));

// this is a simple route to make sure everything is working properly
const runningMessage = `Server running at http://localhost:${PORT}`;
app.get('/', (_req: express.Request, res: express.Response) => {
  res.status(200).send(runningMessage);
});

app.get(/^(.*)$/, function (req, res, next) {
  throw new ResourceUnavailableException(
    `Could not find any resource at ${req.headers.host}${req.url}`
  );
});

// place the error handling middleware at the end of the chain to ensure we catch all errors
app.use(errorHandler);

// handle all kind of server errors
const onError = (error: NodeJS.ErrnoException) => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = `Port ${PORT}`;
  switch (error.code) {
    case 'EACCES':
      logger.error(`${bind} requires elevated privileges`);
      process.exit(1);
    case 'EADDRINUSE':
      logger.error(`Could not start server. ${bind} already in use`);
      process.exit(1);
    default:
      throw error;
  }
};

// this is exported here to prevent the server from listening just from being imported
export default server;

server.on('close', () => {
  // mongooseService.shutdown();
  logger.debug('Server stopped');
});

process.on('SIGINT', function () {
  if (server.listening) {
    logger.debug('Caught signal interrupt. Starting shutdown');
    server.close();
    process.exit(1);
  }
});

server.listen(PORT, () => {
  routes.forEach((route: CommonRoutesConfig) => {
    logger.debug(`Routes configured for ${route.getName()}`);
  });
  mongooseService.connectWithRetry();
  logger.debug(runningMessage);
});

server.on('error', onError);
