const HttpStatus = require("http-status-codes");

// Utils
const ApiError = require("./ApiError");


// Send 404 error to the generic error handler
const notFoundHandler = (req, res, next) => void next(new ApiError("URL not found", HttpStatus.NOT_FOUND));


module.exports = notFoundHandler;