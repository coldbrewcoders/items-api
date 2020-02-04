const express = require("express");
const router = express.Router();
const { param, body } = require("express-validator");
const HttpStatus = require("http-status-codes");

// Middleware
const { isAuthenticatedAdmin, isAuthenticatedAdminOrSelf } = require("../middleware/authorization");
const { validationCheck } = require("../middleware/validation");

// Repository
const { getUserById, modifyUserById, deleteUserById } = require("../repository/queries");

// gRPC
const { sessionServiceGrpcClient } = require("../config/grpc_config");

// Utils
const ApiError = require("../../utils/ApiError");


router.get("/:userId", [

  param("userId")
    .isInt({ min: 1 })

], validationCheck, isAuthenticatedAdminOrSelf, async (req, res, next) => {
  try {
    // Get validated request data
    const { userId } = req.matchedData;

    // Get user info from user id
    const result = await getUserById(userId);

    if (result.rowCount !== 1) {
      throw new ApiError("No user with this id exists.", HttpStatus.BAD_REQUEST);
    }

    // Get values returned from query
    const { id, email, firstname: firstName, lastname: lastName, role, creationdate: creationDate } = result.rows[0];

    res.status(200).json({
      id,
      email,
      firstName,
      lastName,
      role,
      creationDate
    });
  }
  catch (error) {
    // Go to the error handling middleware with the error
    next(error);
  }
});

router.put("/:userId",  [

  param("userId")
    .isInt({ min: 1 }),

  body("email")
    .isEmail()
    .isLength({ min: 1, max: 100 }),

  body("firstName")
    .isLength({ min: 1, max: 100 }),

  body("lastName")
    .isLength({ min: 1, max: 100 }),

], validationCheck, isAuthenticatedAdminOrSelf, async (req, res, next) => {
  try {
    const { userId, email, firstName, lastName } = req.matchedData;

    // Modify user values by user id
    const result = await modifyUserById(userId, email, firstName, lastName);

    if (result.rowCount !== 1) {
      throw new ApiError("No user with this id exists.", HttpStatus.BAD_REQUEST);
    }

    // Check if user is making request on own behalf
    if (req.sessionValues.userId === Number(userId)) {
      // Get values returned from query
      const { email, firstname: firstName, lastname: lastName, role } = result.rows[0];

      // Make gRPC call to session service to replace old session with updated session
      // TODO: Throwing an exception here crashes app for some reason
      sessionServiceGrpcClient.replaceSession({ userId, email, firstName, lastName, role }, (error, { sessionToken }) => {

        // Handle error from gRPC call
        if (error) throw new ApiError("An internal server error occurred.", HttpStatus.INTERNAL_SERVER_ERROR);

        // Return updated user values with new session token
        res.status(200).json({
          sessionToken,
          id: userId,
          email,
          firstName,
          lastName,
          role
        });

      });
    }
    else {
      // User was admin making request on another user's behalf
      res.status(200).end();
    }
  }
  catch (error) {
    // Go to the error handling middleware with the error
    next(error);
  }
});

router.delete("/:userId", [

  param("userId")
    .isInt({ min: 1 })

], validationCheck, isAuthenticatedAdminOrSelf, async (req, res, next) => {
  try {
    // Get validated request data
    const { userId } = req.matchedData;

    // Delete user by passed user id
    const result = await deleteUserById(userId);

    if (result.rowCount !== 1) {
      throw new ApiError("No user with this id exists.", HttpStatus.BAD_REQUEST);
    }

    // Make gRPC call to session service to remove deleted user's session
    // TODO: Throwing an exception here crashes app for some reason
    sessionServiceGrpcClient.removeSession({ userId }, (error) => {

      // Handle error from gRPC call
      if (error) throw new ApiError("An internal server error occurred.", HttpStatus.INTERNAL_SERVER_ERROR);

      res.status(200).end();
    });
  }
  catch (error) {
    // Go to the error handling middleware with the error
    next(error);
  }
});

module.exports = router;