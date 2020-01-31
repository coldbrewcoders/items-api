const get = require("lodash/get");

// gRPC
const { sessionServiceGrpcClient } = require("../config/grpc_config");


const verifySessionToken = (req, res, next) => {
  try {
    // Get Authorization header value
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      // Unauthorized if session token is missing from request
      res.status(401).end();
      return
    }

    // Parse session token from Authorization header
    const sessionToken = authHeader.replace("Bearer ", "");

    if (!sessionToken) {
      // Unauthorized if session token is missing from request
      res.status(401).end();
      return
    }

    // Make gRPC call to session service to validate session token
    sessionServiceGrpcClient.validateSession({ sessionToken }, (error, sessionValues) => {

      if (error) {
        res.status(401).end();
        return;
      }
      
      // Add session values to req object
      req.sessionValues = sessionValues;
      next();
    });

  }
  catch (error) {
    console.error(error);
    res.status(500).end();
  }
}

const isAuthenticatedMiddleware = (req, res, next) => {
  // Check session values for current role
  const role = get(req, "sessionValues.role");

  // Check if user is authenticated based on role
  if (role !== "BASIC" && role !== "ADMIN") {
    res.status(401).end();
    return;
  }
  
  next();
}

const isAuthenticatedAdminMiddleware = (req, res, next) => {
  // Check request for current role
  const role = get(req, "sessionValues.role");

  // Check if authenticated user is an admin
  if (role !== "ADMIN") {
    res.status(403).end();
    return;
  }

  next();
}

const isAuthenticatedAdminOrSelfMiddleware = (req, res, next) => {
  // Get role and user id from session values
  const role = get(req, "sessionValues.role");
  const userId = get(req, "sessionValues.userId");

  // Get user id passed in request param
  const requestUserId = Number(req.params.userId);

  if (!role || !userId) {
    // No role in session values, unauthorized
    res.status(401).end();
  }
  else if (role === "ADMIN") {
    // User is an admin
    next();
  }
  else if (userId === requestUserId) {
    // User is making request on their own behalf
    next();
  }
  else {
    // User is neither an admin nor making request on their own behalf
    res.status(403).end();
  }
}


module.exports = {
  isAuthenticated: [verifySessionToken, isAuthenticatedMiddleware],
  isAuthenticatedAdmin: [verifySessionToken, isAuthenticatedAdminMiddleware],
  isAuthenticatedAdminOrSelf: [verifySessionToken, isAuthenticatedAdminOrSelfMiddleware]
};