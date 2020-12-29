import { transports, format } from 'winston';
import { errorLogger } from 'express-winston';
const { File } = transports;
const { combine, timestamp, json, prettyPrint } = format;

const logger = errorLogger({
  transports: [
    new File({
      level: 'error',
      filename: `${process.cwd()}/logs/errors.log`,
      maxsize: 10485760,
      maxFiles: 10,
      format: combine(timestamp(), json(), prettyPrint()),
    }),
  ],
});

export default logger;
