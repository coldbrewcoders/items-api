const express = require("express");
const router = express.Router();
const { param, body } = require("express-validator");

// Middleware
const { isAuthenticatedAdmin, isAuthenticatedAdminOrSelf } = require("../middleware/authorization");
const { validationCheck } = require("../middleware/validation");

// Repository
const { getUserById, modifyUserById, deleteUserById } = require("../repository/queries");

// gRPC
const { sessionServiceGrpcClient } = require("../config/grpc_config");


router.get("/:userId", [

  param("userId")
    .isInt({ min: 1 })

], validationCheck, isAuthenticatedAdminOrSelf, async (req, res) => {

  // Get validated request data
  const { userId } = req.matchedData;

  // Get user info from user id
  const result = await getUserById(userId);

  if (result.name === "error") {
    res.status(500).end();
    return;
  }

  if (result.rows.length === 0) {
    res.status(400).json({
      message: "No user with this id exists"
    });
    return;
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

], validationCheck, isAuthenticatedAdminOrSelf, async (req, res) => {
  
  const { userId, email, firstName, lastName } = req.matchedData;

  // Modify user values by user id
  const result = await modifyUserById(userId, email, firstName, lastName);

  if (result.name === "error") {
    res.status(500).end();
    return;
  }

  if (result.rows.length === 0) {
    res.status(400).json({
      message: "No user with this id exists"
    });
    return;
  }

  // Check if user is making request on own behalf
  if (req.sessionValues.userId === Number(userId)) {
    // Get values returned from query
    const { email, firstname: firstName, lastname: lastName, role } = result.rows[0];

    // Make gRPC call to session service to replace old session with updated session
    sessionServiceGrpcClient.replaceSession({ userId, email, firstName, lastName, role }, (error, { sessionToken }) => {

      if (error) {
        console.error(error);
        res.status(500).end();
        return;
      }

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
});

router.delete("/:userId", [

  param("userId")
    .isInt({ min: 1 })

], validationCheck, isAuthenticatedAdminOrSelf, async (req, res) => {
  
  // Get validated request data
  const { userId } = req.matchedData;

  // Delete user by passed user id
  const result = await deleteUserById(userId);

  if (result.name === "error") {
    res.status(500).end();
    return;
  }

  if (result.rows.length === 0) {
    res.status(400).json({
      message: "No user with this id exists"
    });
    return;
  }

  // Make gRPC call to session service to remove deleted user's session
  sessionServiceGrpcClient.removeSession({ userId }, (error) => {

    if (error) {
      console.error(error);
      res.status(500).end();
      return;
    }

    res.status(200).end();
  });
});


module.exports = router;