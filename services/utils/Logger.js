const { createLogger, format, transports, config } = require("winston");
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

module.exports = logger;