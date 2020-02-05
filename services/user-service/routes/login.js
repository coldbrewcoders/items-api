const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const HttpStatus = require("http-status-codes");

// Middleware
const { validationCheck } = require("../middleware/validation");

// Repository
const { getUserByEmail } = require("../repository/queries");
const { verifyPassword } = require("../repository/crypt");

// gRPC
const { sessionServiceGrpcClient } = require("../config/grpc_config");

// Utils
const ApiError = require("../../utils/ApiError");


router.post("/", [

  body("email")
    .isEmail()
    .isLength({ min: 1, max: 100 }),

  body("password")
    .isLength({ min: 1, max: 100 })

], validationCheck, async (req, res, next) => {
  try {
    // Get validated request data
    const { email, password: submittedPassword } = req.matchedData;

    // Find user by email address
    const result = await getUserByEmail(email);

    if (result.rowCount !== 1) {
      throw new ApiError(`No user found with email address: ${email}.`, HttpStatus.NOT_FOUND);
    }

    // Get values returned by query
    const { id: userId, password: passwordHash, firstname: firstName, lastname: lastName, role } = result.rows[0];

    // Check if user submitted the correct password
    const isPasswordCorrect = await verifyPassword(submittedPassword, passwordHash);

    if (!isPasswordCorrect) {
      throw new ApiError("Incorrect password.", HttpStatus.UNAUTHORIZED);
    }

    try {
      // Create session for authenticated user with gRPC call to session service
      const { sessionToken } = await sessionServiceGrpcClient.createSession().sendMessage({ userId, email, firstName, lastName, role });

      res.json({
        sessionToken,
        userId,
        email,
        firstName,
        lastName,
        role
      });
    }
    catch (error) {
      // Handle error from gRPC call
      throw new ApiError(error, HttpStatus.UNAUTHORIZED);
    }
  }
  catch (error) {
    // Go to the error handling middleware with the error
    next(error);
  }
});


module.exports = router;