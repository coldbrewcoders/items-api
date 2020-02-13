import { createLogger, format, transports } from "winston";

// Types
import { Logger } from "winston";


// Destruct format functions to combine
const { combine, timestamp, prettyPrint, printf, errors, splat, json } = format;

// Custom Winston formatter for logging
const customFormatter = printf(info => `${info.timestamp} ${info.level}: ${info.message}`);

const logger: Logger = createLogger({
  transports: [new transports.Console()],
  format: combine(
    timestamp(),
    customFormatter,
    errors({ stack: true }),
    splat(),
    json(),
    prettyPrint()
  )
});

export default logger;