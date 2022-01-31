import mongoose, { ConnectOptions } from 'mongoose';
import { dbConnectionUrl } from '../config/db.config';
import ResourceUnavailableException from '../exceptions/resource.unavailable.exception';
import Logger from './logger.service';
const logger = new Logger('SERVICE:mongoose');

class MongooseService {
  private count = 0;
  private maxTries = 3;
  private retrySeconds = 5;
  private mongooseOptions: ConnectOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    useFindAndModify: false
  };

  constructor() {
    this.connectWithRetry();
  }

  getMongoose() {
    return mongoose;
  }

  shutdown() {
    logger.debug('Stopping service...');
    mongoose.connection.close(() => {
      logger.debug('Disconnected from MongoDB');
    });
  }

  connectWithRetry = () => {
    if (mongoose.connection.readyState === 1) {
      logger.debug('Already connected to MongoDB');
      return;
    }
    if (mongoose.connection.readyState === 2) {
      logger.debug('Already connecting to MongoDB');
      return;
    }
    logger.debug('Attempting to connect to MongoDB...');
    mongoose
      .connect(dbConnectionUrl, this.mongooseOptions)
      .then(() => {
        logger.debug('Connected to MongoDB');
      })
      .catch((err) => {
        logger.debug(
          `MongoDB connection attempt #${++this
            .count} unsuccessful. Retrying in ${this.retrySeconds} seconds`
        );
        if (
          err.message.startsWith('querySrv ENOTFOUND') &&
          this.count >= this.maxTries
        ) {
          throw new ResourceUnavailableException(dbConnectionUrl);
        } else if (err.message === 'bad auth : Authentication failed.') {
          logger.error('Invalid MongoDB credentials');
        } else {
          logger.error(err.message);
        }
        setTimeout(this.connectWithRetry, this.retrySeconds * 1000);
      });
  };
}
export default new MongooseService();
