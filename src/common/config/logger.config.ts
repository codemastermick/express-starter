const logDir = 'logs'; // directory logs are stored in
const logExt = 'log'; // extension added to log files
const errorLogName = 'error'; // filename of the error log
const accessLogName = 'access'; // filename of the http access log
const allLogsName = 'all'; // filename for the conjoined log

/* allow you to customize the names of the logging levels
 * !!! Please note that the logger service uses functions
 * based around the default names here. If you wish to use
 * your custom names in the service as well, you will need
 * to update the functions in `./services/logger.service.ts`
 */
export const logLevelNames = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
};

// MUST MATCH THE LENGTH AND NAMES OF THE ABOVE
export const logLevelColours = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white'
};

// configure the timestamp format used by the logging service
export const timestampFormat = 'YYYY-MM-DD HH:mm:ss:ms';

/* DO NOT EDIT BELOW THIS LINE */
export const errorLog = `${logDir}/${errorLogName}.${logExt}`;
export const accessLog = `${logDir}/${accessLogName}.${logExt}`;
export const allLogs = `${logDir}/${allLogsName}.${logExt}`;
