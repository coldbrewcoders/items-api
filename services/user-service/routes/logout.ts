import express from "express";
import HttpStatus from "http-status-codes";

// Middleware
import { isAuthenticated } from "../middleware/authorization";

// gRPC
import { sessionServiceGrpcClient } from "../config/grpc_config";

// Utils
import ApiError from "../../utils/ApiError";

// Types
import { Request, Response, NextFunction, Router } from "express";


// Create express router
const router: Router = express.Router();

router.get("/", isAuthenticated, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Get user id from session values
    const userId: number = req?.sessionValues?.userId;

    try {
      // gRPC call to session service to remove session token
      await sessionServiceGrpcClient.removeSession().sendMessage({ userId });
    }
    catch (error) {
      // Handle error from gRPC call
      throw new ApiError("An internal server error occurred.", HttpStatus.UNAUTHORIZED);
    }

    // Session removed, user is logged out
    res.sendStatus(200);
  }
  catch (error) {
    // Go to the error handling middleware with the error
    next(error);
  }
});

export default router;