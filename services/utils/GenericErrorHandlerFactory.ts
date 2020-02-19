import { INTERNAL_SERVER_ERROR } from "http-status-codes";

// Utils
import ApiError from "./ApiError";

// Types
import { Request, Response, NextFunction } from "express";
import { Logger } from "winston";


// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
const GenericErrorHandlerFactory = (logger: Logger) => (error: ApiError, _req: Request, res: Response, _next: NextFunction): void => {
  // Log the error being thrown
  logger.error(error.message);

  // Set response error status with error JSON
  res.status(error.code || INTERNAL_SERVER_ERROR).json(error);
};

export default GenericErrorHandlerFactory;