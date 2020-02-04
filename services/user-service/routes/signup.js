const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const HttpStatus = require("http-status-codes");

// Middleware
const { validationCheck } = require("../middleware/validation");

// Repository
const { addUser } = require("../repository/queries");
const { generatePasswordHash } = require("../repository/crypt");

// Utils
const ApiError = require("../../utils/ApiError");


router.post("/", [

  body("email")
    .isEmail()
    .isLength({ min: 1, max: 100 }),

  body("password")
    .isLength({ min: 1, max: 100 }),

  body("firstName")
    .isLength({ min: 1, max: 100 }),

  body("lastName")
    .isLength({ min: 1, max: 100 }),

  body("role")
    .isIn(["BASIC", "ADMIN"])

], validationCheck, async (req, res, next) => {
  try {
    // Get validated request data
    const { email, password, firstName, lastName, role } = req.matchedData;

    // Generate safe password for storage
    const safePasswordHash = await generatePasswordHash(password);

    // Send 500 if error occurred creating safe password hash
    if (!safePasswordHash) throw new ApiError("An internal server error occurred.", HttpStatus.INTERNAL_SERVER_ERROR);

    // Add new user to the DB
    const result = await addUser(email, safePasswordHash, firstName, lastName, role);

    if (result.name === "error") {

      // Check if email unique constraint was violated
      if (result.constraint === "users_email_key") {
        throw new ApiError("A user with this email address already exists.", HttpStatus.CONFLICT);
      }

      throw new ApiError("An internal server error occurred.", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    res.sendStatus(200).end();
  }
  catch (error) {
    // Go to the error handling middleware with the error
    return next(error);
  }
});


module.exports = router;