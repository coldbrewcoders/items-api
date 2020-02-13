import express from "express";
import { body } from "express-validator";
import HttpStatus from "http-status-codes";

// Middleware
import { validationCheck } from "../middleware/validation";

// Repository
import { getUserByEmail } from "../repository/queries";
import { verifyPassword } from "../repository/crypt";

// gRPC
import { sessionServiceGrpcClient } from "../config/grpc_config";

// Utils
import ApiError from "../../utils/ApiError";

// Types
import { Request, Response, NextFunction, Router } from "express";
import { QueryResult } from "pg";


// Create express router
const router: Router = express.Router();

router.post("/", [

  body("email")
    .isEmail()
    .isLength({ min: 1, max: 100 }),

  body("password")
    .isLength({ min: 1, max: 100 })

], validationCheck, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Get validated request data
    const { email, password: submittedPassword } = req.matchedData;

    // Find user by email address
    const result: QueryResult<any> = await getUserByEmail(email);

    if (result.rowCount !== 1) {
      throw new ApiError(`No user found with email address: ${email}.`, HttpStatus.NOT_FOUND);
    }

    // Get values returned by query
    const { id: userId, password: passwordHash, firstname: firstName, lastname: lastName, role } = result.rows[0];

    // Check if user submitted the correct password
    const isPasswordCorrect: boolean = await verifyPassword(submittedPassword, passwordHash);

    if (!isPasswordCorrect) {
      throw new ApiError("Incorrect password.", HttpStatus.UNAUTHORIZED);
    }

    try {
      // Create session for authenticated user with gRPC call to session service
      const { sessionToken } = await sessionServiceGrpcClient.createSession().sendMessage({ userId, email, firstName, lastName, role });

      res.json({
        sessionToken,
        userId,
        email,
        firstName,
        lastName,
        role
      });
    }
    catch (error) {
      // Handle error from gRPC call
      throw new ApiError("Error creating user session token", HttpStatus.UNAUTHORIZED);
    }
  }
  catch (error) {
    // Go to the error handling middleware with the error
    next(error);
  }
});

export default router;