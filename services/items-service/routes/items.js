const express = require("express");
const router = express.Router();
const { param, body } = require("express-validator");
const HttpStatus = require("http-status-codes");

// Middleware
const { isAuthenticated, isAuthenticatedAdmin } = require("../middleware/authorization");
const { validationCheck } = require("../middleware/validation");

// Repository
const { getAllItems, getItemsCreatedByUser, getItemsModifiedByUser, getItemById, createItem, updateItemById, deleteItemById } = require("../repository/queries");

// Utils
const ApiError = require("../../utils/ApiError");


router.get("/all", isAuthenticated, async (req, res, next) => {
  try {
    // Get list of all items from DB
    const result = await getAllItems();

    res.json(result.rows);
  }
  catch (error) {
    next(error);
  }
});

router.get("/my-items", isAuthenticated, async (req, res, next) => {
  try {
    // Get current authenticated user's id
    const { userId } = req.sessionValues;

    // Get all items created by current authenticated user
    const result = await getItemsCreatedByUser(userId);

    res.json(result.rows);
  }
  catch (error) {
    next(error);
  }
});

router.get("/created-by-user/:userId", [

  param("userId")
    .isInt({ min: 1 })
  
], validationCheck, isAuthenticatedAdmin, async (req, res, next) => {
  try {
    // Get validated request data
    const { userId } = req.matchedData;

    // Get all items created by passed user id
    const result = await getItemsCreatedByUser(userId);

    res.json(result.rows);
  }
  catch (error) {
    next(error);
  }
});

router.get("/last-modified-by-user/:userId", [

  param("userId")
    .isInt({ min: 1 })

], validationCheck, isAuthenticatedAdmin, async (req, res, next) => {
  try {
    // Get validated request data
    const { userId } = req.matchedData;

    // Get all items last modified by a user
    const result = await getItemsModifiedByUser(userId);

    res.json(result.rows);
  }
  catch (error) {
    next(error);
  }
});

router.get("/:itemId", [

  param("itemId")
    .isInt({ min: 1 })

], validationCheck, isAuthenticated, async (req, res, next) => {
  try {
    // Get validated request data
    const { itemId } = req.matchedData;

    // Get specific item by id
    const result = await getItemById(itemId);

    // Check if item was found for id
    if (result.rowCount !== 1) {
      throw new ApiError(`No item found with id: ${itemId}.`, HttpStatus.NOT_FOUND);
    }

    res.json(result.rows[0]);
  }
  catch (error) {
    next(error);
  }
});

router.post("/", [

  body("name")
    .isLength({ min: 1, max: 100 }),

  body("description")
    .isLength({ min: 1, max: 500 })

], validationCheck, isAuthenticated, async (req, res, next) => {
  try {
    // Get validated request data
    const { name, description } = req.matchedData;

    // Get current authed user's id
    const { userId } = req.sessionValues;

    // Create a new item for this user
    const result = await createItem(name, description, userId);

    res.json(result.rows[0]);
  }
  catch (error) {
    next(error);
  }
});

router.put("/:itemId", [

  param("itemId")
    .isInt({ min: 1 }),

  body("name")
    .isLength({ min: 1, max: 100 }),

  body("description")
    .isLength({ min: 1, max: 500 })

], validationCheck, isAuthenticatedAdmin, async (req, res, next) => {
  try {
    // Get validated request data
    const { itemId, name, description } = req.matchedData;

    // Get currently authed user and role
    const { userId, role } = req.sessionValues;

    // Update item name or description (user must be an admin or own this item)
    const result = await updateItemById(itemId, name, description, userId, role);

    // If no item was modified, user is unauthorized to modify item
    if (result.rowCount !== 1) {
      throw new ApiError(`User does not have permission to modify item: ${itemId}`, HttpStatus.FORBIDDEN);
    }

    res.json(result.rows[0]);
  }
  catch (error) {
    next(error);
  }
});

router.delete("/:itemId", [

  param("itemId")
    .isInt({ min: 1 })

], validationCheck, isAuthenticatedAdmin, async (req, res, next) => {
  try {
    // Get validated request data
    const { itemId } = req.matchedData;

    // Get currently authed user and role
    const { userId, role } = req.sessionValues;

    // Delete item (user must be an admin or own this item)
    const result = await deleteItemById(itemId, userId, role);

    // If no item was modified, user is unauthorized to modify item
    if (result.rowCount !== 1) {
      throw new ApiError(`User does not have permission to delete item: ${itemId}`, HttpStatus.FORBIDDEN);
    }

    res.sendStatus(200);
  }
  catch (error) {
    next(error);
  }
});


module.exports = router;