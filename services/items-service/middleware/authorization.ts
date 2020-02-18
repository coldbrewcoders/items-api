import HttpStatus from "http-status-codes";

// gRPC
import { sessionServiceGrpcClient } from "../config/grpc_config";

// Types
import { Request, Response, NextFunction } from "express";

// Utils
import ApiError from "../../utils/ApiError";


const verifySessionToken = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  try {
    // Get Authorization header value
    const authHeader: string = req.header("Authorization");

    if (!authHeader) {
      // Unauthorized if Authentication header is missing from request
      throw new ApiError("Authentication header is not present", HttpStatus.UNAUTHORIZED);
    }

    // Parse session token from Authorization header
    const sessionToken: string = authHeader.replace("Bearer ", "");

    if (!sessionToken) {
      // Unauthorized if session token is missing from request
      throw new ApiError("Session token is missing from Authentication header", HttpStatus.UNAUTHORIZED);
    }

    // Make gRPC call to session service to validate session token
    const sessionValues: ISessionValues = await sessionServiceGrpcClient.validateSession().sendMessage({ sessionToken });

    // Add session values to req object
    req.sessionValues = sessionValues;

    next();
  }
  catch (error) {
    throw new ApiError("Error validating session token", HttpStatus.UNAUTHORIZED);
  }
}

const isAuthenticatedMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
  // Check session values for current role
  const role: string = req?.sessionValues?.role;

  // Check if user is authenticated based on role
  if (role !== Role.BASIC && role !== Role.ADMIN) {
    throw new ApiError("User does not have valid permission role", HttpStatus.UNAUTHORIZED);
  }

  next();
}

const isAuthenticatedAdminMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
  // Check session values for current role
  const role: string = req?.sessionValues?.role;

  // Check if authenticated user is an admin
  if (role !== Role.ADMIN) {
    throw new ApiError("User does not have an admin role", HttpStatus.FORBIDDEN);
  }

  next();
}


// Bundle middleware functions
const isAuthenticated = [verifySessionToken, isAuthenticatedMiddleware];
const isAuthenticatedAdmin = [verifySessionToken, isAuthenticatedAdminMiddleware];

export { isAuthenticated, isAuthenticatedAdmin };