import { validationResult, matchedData } from "express-validator";
import HttpStatus from "http-status-codes";

// Utils
import ApiError from "../../utils/ApiError";

// Types
import { Request, Response, NextFunction } from "express";
import { ValidationError, Result } from "express-validator";


const validationCheck = (req: Request, _res: Response, next: NextFunction): void => {

  // Check request for validation errors
  const validationErrors: Result<ValidationError> = validationResult(req);

  if (!validationErrors.isEmpty()) {
    // If there are validation errors, return 400 status
    next(new ApiError({ error: validationErrors.mapped() }, HttpStatus.BAD_REQUEST));
  }

  // If there are no validation errors, proceed
  req.matchedData = matchedData(req);

  next();
}

export { validationCheck };