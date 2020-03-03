import express from "express";
import { param, body } from "express-validator";
import HttpStatus from "http-status-codes";

// Middleware
import { isAuthenticatedAdminOrSelf } from "../middleware/authorization";
import { validationCheck } from "../middleware/validation";

// Repository
import { getUserById, modifyUserById, deleteUserById } from "../repository/queries";

// gRPC
import { sessionServiceGrpcClient } from "../config/grpc_config";

// Utils
import ApiError from "../../utils/ApiError";

// Types
import { Request, Response, NextFunction, Router } from "express";
import { QueryResult } from "pg";


interface IUserResponse {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  creationDate: string;
  sessionToken?: string;
}

// Create express router
const router: Router = express.Router();

router.get("/:userId", [

  param("userId")
    .isInt({ min: 1 })

], validationCheck, isAuthenticatedAdminOrSelf, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Get validated request data
    const { userId } = req.matchedData;

    // Get user info from user id
    const result: QueryResult<any> = await getUserById(userId);

    if (result.rowCount !== 1) {
      throw new ApiError("No user with this id exists.", HttpStatus.BAD_REQUEST);
    }

    // Get values returned from query
    const { id, email, first_name: firstName, last_name: lastName, role, creation_date: creationDate } = result.rows[0];

    // Create response payload
    const response: IUserResponse = {
      id,
      email,
      firstName,
      lastName,
      role,
      creationDate
    };

    res.json(response);
  }
  catch (error) {
    // Go to the error handling middleware with the error
    next(error);
  }
});

router.put("/:userId", [

  param("userId")
    .isInt({ min: 1 }),

  body("email")
    .isEmail()
    .isLength({ min: 1, max: 100 }),

  body("firstName")
    .isLength({ min: 1, max: 100 }),

  body("lastName")
    .isLength({ min: 1, max: 100 })

], validationCheck, isAuthenticatedAdminOrSelf, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userId, email, firstName, lastName } = req.matchedData;

    // Modify user values by user id
    const result: QueryResult<any> = await modifyUserById(userId, email, firstName, lastName);

    if (result.rowCount !== 1) {
      throw new ApiError("No user with this id exists.", HttpStatus.BAD_REQUEST);
    }
    else {
      // Get values returned from query
      const { id, email, firstname: firstName, lastname: lastName, role, creationdate: creationDate } = result.rows[0];

      // Check if user is making request on own behalf
      if (req.sessionValues.userId === Number(userId)) {
        try {
          // Make gRPC call to session service to replace old session with updated session
          const { sessionToken } = sessionServiceGrpcClient.replaceSession().sendMessage({ userId, email, firstName, lastName, role });

          // Build response payload
          const response: IUserResponse = {
            id,
            email,
            firstName,
            lastName,
            role,
            creationDate,
            sessionToken
          };

          // Return updated user values with new session token
          res.json(response);
        }
        catch (error) {
          // Handle error from gRPC call
          throw new ApiError("An internal server error occurred.", HttpStatus.UNAUTHORIZED);
        }
      }
      else {
        // Build response payload (no session token included)
        const response: IUserResponse = {
          id,
          email,
          firstName,
          lastName,
          role,
          creationDate
        };

        res.json(response);
      }
    }
  }
  catch (error) {
    // Go to the error handling middleware with the error
    next(error);
  }
});

router.delete("/:userId", [

  param("userId")
    .isInt({ min: 1 })

], validationCheck, isAuthenticatedAdminOrSelf, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Get validated request data
    const { userId } = req.matchedData;

    // Delete user by passed user id
    const result: QueryResult<any> = await deleteUserById(userId);

    if (result.rowCount !== 1) {
      throw new ApiError("No user with this id exists.", HttpStatus.BAD_REQUEST);
    }

    try {
      // Make gRPC call to session service to remove deleted user's session
      await sessionServiceGrpcClient.removeSession().sendMessage({ userId });

      res.sendStatus(200);
    }
    catch (error) {
      // Handle error from gRPC call
      throw new ApiError("An internal server error occurred.", HttpStatus.UNAUTHORIZED);
    }
  }
  catch (error) {
    // Go to the error handling middleware with the error
    next(error);
  }
});

export default router;