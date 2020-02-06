// import { Request, Response, NextFunction } from "express";
// import { validationResult, matchedData, ValidationError, Result } from "express-validator";
// import HttpStatus from "http-status-codes";

// // Utils
// const ApiError = require("../../utils/ApiError");


// const validationCheck = (req: Request, _res: Response, next: NextFunction) => {

//   // Check request for validation errors
//   const validationErrors: Result<ValidationError> = validationResult(req);

//   if (!validationErrors.isEmpty()) {
//     // If there are validation errors, return 400 status
//     throw new ApiError({ error: validationErrors.mapped() }, HttpStatus.BAD_REQUEST);
//   }

//   // If there are no validation errors, proceed
//   req.matchedData = matchedData(req);
//   next();
// }


// module.exports = {
//   validationCheck
// };