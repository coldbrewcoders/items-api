import { INTERNAL_SERVER_ERROR } from "http-status-codes";

// Utils
import ApiError from "./ApiError";
import logger from "./Logger";

// Types
import { Request, Response } from "express";


const genericErrorHandler = (error: ApiError, _req: Request, res: Response) => {
  // Log the error being thrown
  logger.error(`ERROR: ${error}`);

  // Set response error status with error JSON
  res.status(error.code || INTERNAL_SERVER_ERROR).json(error);
};

export default genericErrorHandler;