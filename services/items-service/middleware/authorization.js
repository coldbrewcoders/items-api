const get = require("lodash/get");
const HttpStatus = require("http-status-codes");

// Utils
const ApiError = require("../../utils/ApiError");

// gRPC
const { sessionServiceGrpcClient } = require("../config/grpc_config");


const verifySessionToken = async (req, res, next) => {

  // Get Authorization header value
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    // Unauthorized if Authentication header is missing from request
    throw new ApiError("Authentication header is not present", HttpStatus.UNAUTHORIZED);
  }

  // Parse session token from Authorization header
  const sessionToken = authHeader.replace("Bearer ", "");

  if (!sessionToken) {
    // Unauthorized if session token is missing from request
    throw new ApiError("Session token is missing from Authentication header", HttpStatus.UNAUTHORIZED);
  }

  try {
    // Make gRPC call to session service to validate session token
    const sessionValues = await sessionServiceGrpcClient.validateSession().sendMessage({ sessionToken });

    // Add session values to req object
    req.sessionValues = sessionValues;
    next();
  }
  catch (error) {
    next(new ApiError("Error validating session token", HttpStatus.UNAUTHORIZED));
  }
}

const isAuthenticatedMiddleware = (req, res, next) => {
  // Check session values for current role
  const role = get(req, "sessionValues.role");

  // Check if user is authenticated based on role
  if (role !== "BASIC" && role !== "ADMIN") {
    next(new ApiError("User does not have valid permission role", HttpStatus.UNAUTHORIZED));
  }
  
  next();
}

const isAuthenticatedAdminMiddleware = (req, res, next) => {
  // Check request for current role
  const role = get(req, "sessionValues.role");

  // Check if authenticated user is an admin
  if (role !== "ADMIN") {
    next(new ApiError("User does not have an admin role", HttpStatus.FORBIDDEN));
  }

  next();
}


module.exports = {
  isAuthenticated: [verifySessionToken, isAuthenticatedMiddleware],
  isAuthenticatedAdmin: [verifySessionToken, isAuthenticatedAdminMiddleware]
};