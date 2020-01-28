const express = require("express");
const router = express.Router();


// For the methods below, you must either be an admin or calling on behalf of yourself

router.get("/:userId", (req, res) => {
  res.status(200).end();
});

router.post("/:userId", (req, res) => {
  res.status(200).end();
});

router.put("/:userId", (req, res) => {
  res.status(200).end();
});

router.delete("/:userId", (req, res) => {
  res.status(200).end();
});


module.exports = router;