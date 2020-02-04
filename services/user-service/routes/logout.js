const express = require("express");
const router = express.Router();
const HttpStatus = require("http-status-codes");

// Middleware
const { isAuthenticated } = require("../middleware/authorization");

// gRPC
const { sessionServiceGrpcClient } = require("../config/grpc_config");

// Utils
const ApiError = require("../../utils/ApiError");


router.get("/", isAuthenticated, (req, res, next) => {
  try {
    // Get user id from session values
    const { userId } = req.sessionValues;

    // gRPC call to session service to remove session token
    sessionServiceGrpcClient.removeSession({ userId }, (error) => {

      // Handle error from gRPC call
      if (error) throw new ApiError("An internal server error occurred.", HttpStatus.INTERNAL_SERVER_ERROR);

      // Session removed, user is logged out
      res.status(200).end();
    });
  }
  catch (error) {
    // Go to the error handling middleware with the error
    next(error);
  }
});


module.exports = router;