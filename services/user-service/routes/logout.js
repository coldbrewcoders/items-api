const express = require("express");
const router = express.Router();

// Middleware
const { isAuthenticated } = require("../middleware/authorization");

// gRPC
const { sessionServiceGrpcClient } = require("../config/grpc_config");


router.get("/", isAuthenticated, (req, res) => {
  
  // Get user id from session values
  const { userId } = req.sessionValues;

  // gRPC call to session service to remove session token
  sessionServiceGrpcClient.removeSession({ userId }, (error) => {

    if (error) {
      console.error(error);
      res.status(500).end();
      return;
    }

    // Session removed, user is logged out
    res.status(200).end();
  });
});


module.exports = router;