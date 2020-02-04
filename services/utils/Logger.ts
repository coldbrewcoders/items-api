import { createLogger, format, transports } from "winston";

// Destruct format functions to combine
const { combine, timestamp, prettyPrint, printf, colorize, errors, splat, json } = format;

// Custom Winston formatter for logging
const customFormatter = printf(info => `${info.timestamp} ${info.level}: ${info.message}`);

const logger = createLogger({
  transports: [new transports.Console()],
  format: combine(
    colorize(),
    timestamp(),
    customFormatter,
    errors({ stack: true }),
    splat(),
    json(),
    prettyPrint()
  )
});

export default logger;