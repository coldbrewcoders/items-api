const { validationResult } = require("express-validator");
const { matchedData } = require("express-validator");


const validationCheck = (req, res, next) => {

  // Check request for validation errors
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    // If there are validation errors, return 400 status
    res.status(400).json({
      error: validationErrors.mapped()
    });
    return;
  }

  // If there are no validation errors, proceed
  req.matchedData = matchedData(req);
  next();
}


module.exports = {
  validationCheck
};