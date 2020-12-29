import { createLogger, format, transports } from 'winston';
const { printf, colorize, timestamp, combine, label } = format;
const { File, Console } = transports;

const fileFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level} - ${message}`;
});

const consoleFormat = printf(({ label, level, message, timestamp }) => {
  return `[${timestamp}] [${label}] ${level} - ${message}`;
});

const logger = createLogger({
  level: 'info',
  format: combine(
    format((info) => {
      info.level = info.level.toUpperCase();
      return info;
    })(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    fileFormat,
  ),
  transports: [new File({ filename: `${process.cwd()}/logs/activity.log` })],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new Console({
      format: combine(
        format((info) => {
          info.level = info.level.toUpperCase();
          return info;
        })(),
        colorize(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        label({ label: 'ACTIVITY' }),
        consoleFormat,
      ),
    }),
  );
}

export default logger;
