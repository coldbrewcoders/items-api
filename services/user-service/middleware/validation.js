const { validationResult } = require("express-validator");
const { matchedData } = require("express-validator");
const HttpStatus = require("http-status-codes");

// Utils
const ApiError = require("../../utils/ApiError");


const validationCheck = (req, res, next) => {

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


module.exports = {
  validationCheck
};