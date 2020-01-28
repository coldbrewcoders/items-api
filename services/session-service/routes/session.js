const express = require("express");
const router = express.Router();


router.get("/is-valid-session", (req, res) => {
  // Check if JWT token from header is valid
  res.status(200).end();
});

router.get("/number-of-sessions", (req, res) => {
  // Return number of active sessions 
  res.status(200).end();
});

router.get("/clear-all", (req, res) => {
  // Revoke all active sessions
  res.status(200).end();
});


module.exports = router;