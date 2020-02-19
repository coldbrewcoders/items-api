import { createLogger, format, transports } from "winston";

// Types
import { Logger } from "winston";


// Destruct format functions to combine
const { combine, timestamp, label, printf } = format;

// Custom Winston formatter for logging
const customFormatter = printf(({ timestamp, level, label, message }) => `${timestamp} ${level} -- ${label}: ${message}`);

const LoggerFactory = (serviceName: string): Logger => createLogger({
  transports: [new transports.Console()],
  format: combine(
    timestamp(),
    label({ label: serviceName }),
    customFormatter
  )
});

export default LoggerFactory;