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

    // Add new user to the DB
    const result = await addUser(email, safePasswordHash, firstName, lastName, role);

    res.sendStatus(200).end();
  }
  catch (error) {
    // Go to the error handling middleware with the error
    next(error);
  }
});


module.exports = router;