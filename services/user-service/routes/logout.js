const express = require("express");
const router = express.Router();
const HttpStatus = require("http-status-codes");

// Middleware
const { isAuthenticated } = require("../middleware/authorization");

// gRPC
const { sessionServiceGrpcClient } = require("../config/grpc_config");

// Utils
const ApiError = require("../../utils/ApiError");


router.get("/", isAuthenticated, async (req, res, next) => {
  try {
    // Get user id from session values
    const { userId } = req.sessionValues;

    try {
      // gRPC call to session service to remove session token
      await sessionServiceGrpcClient.removeSession().sendMessage({ userId });
    }
    catch (error) {
      // Handle error from gRPC call
      throw new ApiError("An internal server error occurred.", HttpStatus.UNAUTHORIZED);
    }

    // Session removed, user is logged out
    res.sendStatus(200);
  }
  catch (error) {
    // Go to the error handling middleware with the error
    next(error);
  }
});


module.exports = router;