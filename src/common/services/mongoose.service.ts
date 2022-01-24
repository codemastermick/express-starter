import mongoose, { ConnectOptions } from 'mongoose';
import debug from 'debug';
import { dbConnectionUrl } from '../config/db.config';

const log: debug.IDebugger = debug('app:mongoose-service');
// const dbURL = "172.24.213.86";
const dbURL = 'localhost';
const dbPort = '27017';
const databaseName = 'express-template';

class MongooseService {
  private count = 0;
  private mongooseOptions: ConnectOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    useFindAndModify: false,
  };

  constructor() {
    this.connectWithRetry();
  }

  getMongoose() {
    return mongoose;
  }

  connectWithRetry = () => {
    log('Attempting MongoDB connection (will retry if needed)');
    mongoose
      .connect(dbConnectionUrl, this.mongooseOptions)
      .then(() => {
        log('MongoDB is connected');
      })
      .catch((err) => {
        const retrySeconds = 5;
        log(
          `MongoDB connection unsuccessful (will retry #${++this
            .count} after ${retrySeconds} seconds):`,
          err
        );
        setTimeout(this.connectWithRetry, retrySeconds * 1000);
      });
  };
}
export default new MongooseService();
