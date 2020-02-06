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

    res.json({
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

      try {
        // Make gRPC call to session service to replace old session with updated session
        const { sessionToken } = sessionServiceGrpcClient.replaceSession().sendMessage({ userId, email, firstName, lastName, role });

        // Return updated user values with new session token
        res.json({
          sessionToken,
          id: userId,
          email,
          firstName,
          lastName,
          role
        });
      }
      catch (error) {
        // Handle error from gRPC call
        throw new ApiError("An internal server error occurred.", HttpStatus.UNAUTHORIZED);
      }
    }
    else {
      // User was admin making request on another user's behalf
      res.sendStatus(200);
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

    try {
      // Make gRPC call to session service to remove deleted user's session
      await sessionServiceGrpcClient.removeSession().sendMessage({ userId });

      res.sendStatus(200);
    }
    catch (error) {
      // Handle error from gRPC call
      throw new ApiError("An internal server error occurred.", HttpStatus.UNAUTHORIZED);
    }
  }
  catch (error) {
    // Go to the error handling middleware with the error
    next(error);
  }
});

module.exports = router;