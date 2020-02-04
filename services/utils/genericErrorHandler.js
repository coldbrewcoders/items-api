const HttpStatus = require("http-status-codes");

// Logger
const logger = require("./Logger");


const genericErrorHandler = (error, req, res, next) => {
    // Log the error being thrown
    logger.error("An ApiError is going to be returned => " + error);

    // Set response error status with error JSON
    res.status(error.code || HttpStatus.INTERNAL_SERVER_ERROR);
    res.json(error);
};


module.exports = genericErrorHandler;