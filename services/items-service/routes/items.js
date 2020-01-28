const express = require("express");
const router = express.Router();

// Middleware
const { isAuthenticated, isAuthenticatedAdmin } = require("../middleware/authorization");


router.get("/all", isAuthenticated, (req, res) => {
  // TODO: return list of all items
  res.status(200).end();
});

router.get("/my-items", isAuthenticatedAdmin, (req, res) => {
  // TODO: return list of items authed user has created (must be admin to create items)
  res.status(200).end();
});

router.get("/created-by-user/:userId", isAuthenticatedAdmin, (req, res) => {
  // TODO: return all items created by a specific user
  res.status(200).end();
});

router.get("/last-modified-by-user/:userId", isAuthenticatedAdmin, (req, res) => {
  // TODO: return all items last modified by a specific user
  res.status(200).end();
});

router.get("/:itemId", isAuthenticated, (req, res) => {
  // TODO: Return specific item by id
  res.status(200).end();
});

router.post("/:itemId", isAuthenticatedAdmin, (req, res) => {
  // TODO: Create new item (must be admin)
  res.status(200).end();
});

router.put("/:itemId", isAuthenticatedAdmin, (req, res) => {
  // TODO: Modify item (must be admin)
  res.status(200).end();
});

router.delete("/:itemId", isAuthenticatedAdmin, (req, res) => {
  // TODO: Delete item (must be admin)
  res.status(200).end();
});


module.exports = router;