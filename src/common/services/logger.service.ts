import winston from 'winston';
import debug from 'debug';
import {
  accessLog,
  allLogs,
  logLevelColours,
  errorLog,
  logLevelNames,
  timestampFormat
} from '../config/logger.config';

const { combine, timestamp, label } = winston.format;
const NODE_ENV = process.env.NODE_ENV as string;

const level = () => {
  const env = NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'warn';
};

const format = winston.format.combine(
  winston.format.timestamp({ format: timestampFormat }),
  winston.format.colorize({ all: true, colors: logLevelColours }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: timestampFormat }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

const transports = [
  new winston.transports.Console({ format }),
  new winston.transports.File({
    filename: errorLog,
    level: 'error',
    format: fileFormat
  }),
  new winston.transports.File({
    filename: allLogs,
    format: fileFormat
  })
];

const requestTransport = [
  new winston.transports.File({
    filename: accessLog,
    format: fileFormat
  })
];

export default class Logger {
  private log: winston.Logger;
  private requestLogger: winston.Logger;
  private debugLog: debug.IDebugger;

  constructor(appName: string) {
    this.log = winston.createLogger({
      level: level(),
      levels: logLevelNames,
      format: combine(label({ label: appName, message: true }), timestamp()),
      transports
    });
    this.requestLogger = winston.createLogger({
      level: 'http',
      levels: { http: 0 },
      format: combine(label({ label: appName, message: true }), timestamp()),
      transports: requestTransport
    });
    this.debugLog = debug(appName);
  }

  error(message: string) {
    this.log.error(message);
  }

  warn(message: string) {
    this.log.warn(message);
  }

  info(message: string) {
    this.log.info(message);
  }

  http(message: string) {
    this.log.http(message);
    this.requestLogger.http(message);
  }

  debug(message: string) {
    this.log.debug(message);
    this.debugLog(message);
  }
}
