import { validationResult, matchedData } from "express-validator";
import HttpStatus from "http-status-codes";

// Utils
import ApiError from "../../utils/ApiError";

// Types
import { Request, Response, NextFunction } from "express";


const validationCheck = (req: Request, _res: Response, next: NextFunction): void => {

  // Check request for validation errors
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    // If there are validation errors, return 400 status
    throw new ApiError({ error: validationErrors.mapped() }, HttpStatus.BAD_REQUEST);
  }

  // If there are no validation errors, proceed
  req.matchedData = matchedData(req);
  next();
}

export { validationCheck };