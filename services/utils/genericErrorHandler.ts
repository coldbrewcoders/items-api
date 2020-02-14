import { INTERNAL_SERVER_ERROR } from "http-status-codes";

// Utils
import ApiError from "./ApiError";
import logger from "./Logger";

// Types
import { Request, Response, NextFunction } from "express";


// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
const genericErrorHandler = (error: ApiError, _req: Request, res: Response, _next: NextFunction): void => {
  // Log the error being thrown
  logger.error(`ERROR: ${error.message}`);

  // Set response error status with error JSON
  res.status(error.code || INTERNAL_SERVER_ERROR).json(error);
};

export default genericErrorHandler;