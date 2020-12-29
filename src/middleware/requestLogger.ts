import { format, transports } from 'winston';
import expressWinston from 'express-winston';
const { Console, File } = transports;
const { combine, timestamp, json, prettyPrint, colorize, printf, label } = format;

const consoleFormat = printf(({ label, level, message, timestamp }) => {
  return `[${timestamp}] [${label}] ${level} - ${message}`;
});

const logger = expressWinston.logger({
  transports: [
    new Console({
      level: 'info',
      handleExceptions: true,
      format: combine(
        format((info) => {
          info.level = info.level.toUpperCase();
          return info;
        })(),
        colorize(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        label({ label: 'REQUEST' }),
        consoleFormat,
      ),
    }),
    new File({
      level: 'info',
      filename: `${process.cwd()}/logs/requests.log`,
      maxsize: 10485760, // 10mb
      maxFiles: 10,
      format: combine(timestamp(), json(), prettyPrint()),
    }),
  ],
});

export default logger;
