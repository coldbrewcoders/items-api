import express from "express";
import { param, body } from "express-validator";
import HttpStatus from "http-status-codes";

// Config
import { sendNotificationToQueue } from "../config/rabbitmq_config";

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

    // Get session values for notification
    const { firstName, email } = req.sessionValues;

    // Create the content of the email notification
    const emailNotification: IEmailNotification = {
      email,
      firstName,
      subject: "You have created a new item!",
      messageHeader: `You just created an item named ${name}`,
      messageBody: `The description for ${name} is: ${description}.`
    };

    // Send item created notification to queue
    await sendNotificationToQueue(emailNotification);

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
    const role: string = req?.sessionValues?.role;

    // Update item name or description (user must be an admin or own this item)
    const result: QueryResult<any> = await updateItemById(itemId, name, description, String(userId), role);

    // If no item was modified, user is unauthorized to modify item
    if (result.rowCount !== 1) {
      throw new ApiError(`User does not have permission to modify item: ${itemId}`, HttpStatus.FORBIDDEN);
    }

    const email: string = req?.sessionValues?.email;
    const firstName: string = req?.sessionValues?.firstName;

    // Create the content of the email notification
    const emailNotification: IEmailNotification = {
      email,
      firstName,
      subject: "You have modified a new item!",
      messageHeader: `You just modified an item, now named ${name}`,
      messageBody: `The description for ${name} is: ${description}.`
    };

    // Send user an email saying that they've modified an item
    await sendNotificationToQueue(emailNotification);

    // Get user id of who the item was created by
    // const { createdbyuserId: createdByUserId } = result.rows[0];

    // if (userId !== createdByUserId) {
      // User modified an item created by a different user, send owner of item an email
      // TODO: Make gRPC call to user-service to get email address for user
      // TODO: Send email to this user to notify them that their item has been modified
    // }

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
    const role: string = req?.sessionValues?.role;

    // Delete item (user must be an admin or own this item)
    const result: QueryResult<any> = await deleteItemById(itemId, String(userId), role);

    // If no item was modified, user is unauthorized to modify item
    if (result.rowCount !== 1) {
      throw new ApiError(`User does not have permission to delete item: ${itemId}`, HttpStatus.FORBIDDEN);
    }

    const { name, description } = result.rows[0];

    const email: string = req?.sessionValues?.email;
    const firstName: string = req?.sessionValues?.firstName;

    // Create the content of the email notification
    const emailNotification: IEmailNotification = {
      email,
      firstName,
      subject: "You have deleted an item!",
      messageHeader: `You just deleted an item named ${name}`,
      messageBody: `The description for ${name} was: ${description}.`
    };

    // Send user an email saying that they've deleted an item
    await sendNotificationToQueue(emailNotification);

    // Get user id of who the item was created by
    // const { createdbyuserId: createdByUserId } = result.rows[0];

    // if (userId !== createdByUserId) {
      // User deleted an item created by a different user, send owner of item an email
      // TODO: Make gRPC call to user-service to get email address for user
      // TODO: Send email to this user to notify them that their item has been modified
    // }

    res.sendStatus(200);
  }
  catch (error) {
    // Go to the error handling middleware with the error
    next(error);
  }
});


export default router;