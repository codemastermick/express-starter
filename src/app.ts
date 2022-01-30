import dotenv from 'dotenv';
// const dotenvResult = dotenv.config();
try {
  dotenv.config();
} catch (error) {
  console.log(error);
}

// if (dotenvResult.error) {
//   throw dotenvResult.error;
// }

import express from 'express';
import * as http from 'http';
import cors from 'cors';
import { CommonRoutesConfig } from './common/common.routes.config';
import { UsersRoutes } from './users/users.routes.config';
import { AuthRoutes } from './auth/auth.routes.config';
import helmet from 'helmet';
import morganMiddleware from './common/middleware/morgan.middleware';
import Logger from './common/services/logger.service';

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const port = process.env.PORT;
const routes: Array<CommonRoutesConfig> = [];
const logger: Logger = new Logger('express-starter');

// here we are adding middleware to parse all incoming requests as JSON
app.use(express.json());

// here we are adding middleware to allow cross-origin requests
app.use(cors());
// the helmet middleware is a collection of settings for http server security
app.use(helmet());
// this is our custom logging middleware
app.use(morganMiddleware);

// here we are adding the UserRoutes to our array,
// after sending the Express.js application object to have the routes added to our app!
routes.push(new UsersRoutes(app));
// now we add the auth routes the same way as above
routes.push(new AuthRoutes(app));

// this is a simple route to make sure everything is working properly
const runningMessage = `Server running at http://localhost:${port}`;
app.get('/', (req: express.Request, res: express.Response) => {
  res.status(200).send(runningMessage);
});

export default server;

server.listen(port, () => {
  routes.forEach((route: CommonRoutesConfig) => {
    logger.debug(`Routes configured for ${route.getName()}`);
  });
  logger.debug(runningMessage);
});
