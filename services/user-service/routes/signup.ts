import express from "express";
import { body } from "express-validator";
import HttpStatus from "http-status-codes";

// Middleware
import { validationCheck } from "../middleware/validation";

// Repository
import { addUser } from "../repository/queries";
import { generatePasswordHash } from "../repository/crypt";

// Utils
import ApiError from "../../utils/ApiError";

// Types
import { Request, Response, NextFunction, Router } from "express";


// Create express router
const router: Router = express.Router();

router.post("/", [

  body("email")
    .isEmail()
    .isLength({ min: 1, max: 100 }),

  body("password")
    .isLength({ min: 1, max: 100 }),

  body("firstName")
    .isLength({ min: 1, max: 100 }),

  body("lastName")
    .isLength({ min: 1, max: 100 }),

  body("role")
    .isIn(["BASIC", "ADMIN"])

], validationCheck, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Get validated request data
    const { email, password, firstName, lastName, role } = req.matchedData;

    // Generate safe password for storage
    const safePasswordHash: string = await generatePasswordHash(password);

    // Send 500 if error occurred creating safe password hash
    if (!safePasswordHash) throw new ApiError("An internal server error occurred.", HttpStatus.INTERNAL_SERVER_ERROR);

    // Add new user to the DB
    await addUser(email, safePasswordHash, firstName, lastName, role);

    res.sendStatus(200);
  }
  catch (error) {
    // Go to the error handling middleware with the error
    return next(error);
  }
});

export default router;