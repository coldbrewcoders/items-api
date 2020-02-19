import LoggerFactory from "../../utils/LoggerFactory";

// Types
import { Logger } from "winston";


// Define service name to prefix logged messages
const SERVICE_NAME = "ITEMS_SERVICE";

// Create logger for service
const logger: Logger = LoggerFactory(SERVICE_NAME);

export default logger;