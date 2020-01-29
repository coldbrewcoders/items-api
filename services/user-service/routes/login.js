const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

// Middleware
const { validationCheck } = require("../middleware/validation");

// Repository
const { getUserByEmail } = require("../repository/queries");
const { verifyPassword } = require("../repository/crypt");

// gRPC
const { sessionServiceGrpcClient } = require("../config/grpc_config");


router.post("/", [

  body("email")
    .isEmail()
    .isLength({ min: 1, max: 100 }),

  body("password")
    .isLength({ min: 1, max: 100 })

], validationCheck, async (req, res) => {
  
  const { email, password: submittedPassword } = req.matchedData;

  // Find user by email address
  const result = await getUserByEmail(email);

  // If no results found..
  if (result.rowCount !== 1) {

    res.status(404).json({
      message: `No user found with email address: ${email}`
    });

  }
  else {

    const { id: userId, password: passwordHash, firstname: firstName, lastname: lastName, role } = result.rows[0];

    // Check if user submitted the correct password
    const isPasswordCorrect = await verifyPassword(submittedPassword, passwordHash);

    if (!isPasswordCorrect) {

      res.status(401).json({
        message: "Incorrect password"
      });

    }
    else {

      // Create session for authenticated user with gRPC call to session service
      sessionServiceGrpcClient.createSession({ userId, email, firstName, lastName, role }, (error, { sessionToken }) => {

        if (error) {
          console.error(error);
          res.sendStatus(500);
        }
        else {
          
          res.status(200).json({ 
            sessionToken,
            userId,
            email,
            firstName,
            lastName,
            role
          });
        }

      });

    }
  }
});


module.exports = router;