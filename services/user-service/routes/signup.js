const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

// Middleware
const { validationCheck } = require("../middleware/validation");

// Repository
const { addUser } = require("../repository/queries");
const { generatePasswordHash } = require("../repository/crypt");


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

], validationCheck, async (req, res) => {

  // Get validated request data
  const { email, password, firstName, lastName, role } = req.matchedData;

  // Generate safe password for storage
  const safePasswordHash = await generatePasswordHash(password);

  // Send 500 if error occurred creating safe password hash
  if (!safePasswordHash) {
    res.sendStatus(500).end();
    return;
  }

  // Add new user to the DB
  const result = await addUser(email, safePasswordHash, firstName, lastName, role);

  if (result.name === "error") {

    // Check if email unique constraint was violated
    if (result.constraint === "users_email_key") {
      res.status(409).json({
        message: "A user with this email address already exists."
      });
      return;
    }
    
    res.sendStatus(500).end();
    return;
  }

  res.sendStatus(200).end();
});


module.exports = router;