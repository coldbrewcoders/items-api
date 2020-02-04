import { INTERNAL_SERVER_ERROR } from "http-status-codes";
import { Request, Response } from "express";

// Utils
import ApiError from "./ApiError";
import logger from "./Logger";


const genericErrorHandler = (error: ApiError, _req: Request, res: Response) => {
  // Log the error being thrown
  logger.error("An ApiError is going to be returned => " + error);

  // Set response error status with error JSON
  res.status(error.code || INTERNAL_SERVER_ERROR);
  res.json(error);
};

export default genericErrorHandler;