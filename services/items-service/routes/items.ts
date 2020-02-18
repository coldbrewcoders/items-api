import express from "express";
import { param, body } from "express-validator";
import HttpStatus from "http-status-codes";

// Middleware
import { isAuthenticated, isAuthenticatedAdmin } from "../middleware/authorization";
import { validationCheck } from "../middleware/validation";

// Repository
import {
  getAllItems,
  getItemsCreatedByUser,
  getItemsModifiedByUser,
  getItemById,
  createItem,
  updateItemById,
  deleteItemById
} from "../repository/queries";

// Utils
import ApiError from "../../utils/ApiError";

// Types
import { Request, Response, NextFunction, Router } from "express";
import { QueryResult } from "pg";


// Create express router
const router: Router = express.Router();

router.get("/all", isAuthenticated, async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Get list of all items from DB
    const result: QueryResult<any> = await getAllItems();

    res.json(result.rows);
  }
  catch (error) {
    // Go to the error handling middleware with the error
    next(error);
  }
});

router.get("/my-items", isAuthenticated, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Get current authenticated user's id
    const userId: string = String(req?.sessionValues?.userId);

    // Get all items created by current authenticated user
    const result: QueryResult<any> = await getItemsCreatedByUser(userId);

    res.json(result.rows);
  }
  catch (error) {
    // Go to the error handling middleware with the error
    next(error);
  }
});

router.get("/created-by-user/:userId", [

  param("userId")
    .isInt({ min: 1 })

], validationCheck, isAuthenticatedAdmin, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Get validated request data
    const userId: string = req?.matchedData?.userId;

    // Get all items created by passed user id
    const result: QueryResult<any> = await getItemsCreatedByUser(userId);

    res.json(result.rows);
  }
  catch (error) {
    // Go to the error handling middleware with the error
    next(error);
  }
});

router.get("/last-modified-by-user/:userId", [

  param("userId")
    .isInt({ min: 1 })

], validationCheck, isAuthenticatedAdmin, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Get validated request data
    const userId: string = req?.matchedData?.userId;

    // Get all items last modified by a user
    const result: QueryResult<any> = await getItemsModifiedByUser(userId);

    res.json(result.rows);
  }
  catch (error) {
    // Go to the error handling middleware with the error
    next(error);
  }
});

router.get("/:itemId", [

  param("itemId")
    .isInt({ min: 1 })

], validationCheck, isAuthenticated, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Get validated request data
    const itemId: string = req?.matchedData?.itemId;

    // Get specific item by id
    const result: QueryResult<any> = await getItemById(itemId);

    // Check if item was found for id
    if (result.rowCount !== 1) {
      throw new ApiError(`No item found with id: ${itemId}.`, HttpStatus.NOT_FOUND);
    }

    res.json(result.rows[0]);
  }
  catch (error) {
    // Go to the error handling middleware with the error
    next(error);
  }
});

router.post("/", [

  body("name")
    .isLength({ min: 1, max: 100 }),

  body("description")
    .isLength({ min: 1, max: 500 })

], validationCheck, isAuthenticated, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Get validated request data
    const { name, description } = req.matchedData;

    // Get current authed user's id
    const userId: string = String(req?.sessionValues?.userId);

    // Create a new item for this user
    const result: QueryResult<any> = await createItem(name, description, userId);

    res.json(result.rows[0]);
  }
  catch (error) {
    // Go to the error handling middleware with the error
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

], validationCheck, isAuthenticatedAdmin, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Get validated request data
    const { itemId, name, description } = req.matchedData;

    // Get currently authed user and role
    const userId: number = req?.sessionValues?.userId;
    const role: Role = req?.sessionValues?.role;

    // Update item name or description (user must be an admin or own this item)
    const result: QueryResult<any> = await updateItemById(itemId, name, description, String(userId), role);

    // If no item was modified, user is unauthorized to modify item
    if (result.rowCount !== 1) {
      throw new ApiError(`User does not have permission to modify item: ${itemId}`, HttpStatus.FORBIDDEN);
    }

    res.json(result.rows[0]);
  }
  catch (error) {
    // Go to the error handling middleware with the error
    next(error);
  }
});

router.delete("/:itemId", [

  param("itemId")
    .isInt({ min: 1 })

], validationCheck, isAuthenticatedAdmin, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Get validated request data
    const itemId: string = req?.matchedData?.itemId;

    // Get currently authed user and role
    const userId: number = req?.sessionValues?.userId;
    const role: Role = req?.sessionValues?.role;

    // Delete item (user must be an admin or own this item)
    const result: QueryResult<any> = await deleteItemById(itemId, String(userId), role);

    // If no item was modified, user is unauthorized to modify item
    if (result.rowCount !== 1) {
      throw new ApiError(`User does not have permission to delete item: ${itemId}`, HttpStatus.FORBIDDEN);
    }

    res.sendStatus(200);
  }
  catch (error) {
    // Go to the error handling middleware with the error
    next(error);
  }
});


export default router;