const express = require("express");
const router = express.Router();


router.post("/logout", isAuthenticated, (req, res) => {
  // TODO: log out user by removing session (grpc call to auth service)
  res.status(200).end();
});


module.exports = router;