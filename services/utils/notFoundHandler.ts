import { Request, Response, NextFunction } from "express";
import HttpStatus from "http-status-codes";

// Utils
import ApiError from "./ApiError";


// Send 404 error to the generic error handler
const notFoundHandler = (_req: Request, _res: Response, next: NextFunction): void => {
  next(new ApiError("URL not found", HttpStatus.NOT_FOUND))
};


export default notFoundHandler;