require('winston-daily-rotate-file');
require('winston-mongodb');
const { createLogger, format, transports } = require('winston');
const { combine, label, timestamp, printf } = format;

const CATEGORY = 'MoviesLand';
const customFormat = printf(({level, message, label, timestamp}) => {
  return `${timestamp} [${label}] ${level.toUpperCase()}: ${message}`;  // e.g. 20-04-2026 17:15:17 [MoviesLand] INFO: Connection to MongoDB established
});

const logger = createLogger({
  level: 'info',
  format: combine(
    label({ label: CATEGORY }),
    timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
    format.json()
  ),
  transports: [
    new transports.Console({
      format: customFormat
    }),
    new transports.DailyRotateFile({
      filename: 'logs/rotate-%DATE%.log',
      datePattern: 'DD-MM-YYYY',
      maxFiles: '14d'
    }),
    new transports.DailyRotateFile({
      level: 'error',
      filename: 'logs/error-rotate-%DATE%.log',
      datePattern: 'DD-MM-YYYY',
      maxFiles: '14d'
    }),
    new transports.MongoDB({
      level: 'error',
      db: process.env.MONGODB_URI,
      dbName: 'moviesdb',
      collection: 'logs'
    })
  ]
});

module.exports = logger;