// gRPC
const { sessionServiceGrpcClient } = require("../config/grpc_config");


const verifySessionToken = (req, res, next) => {
  try {

    // Get session token from Authorization header
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      // Unauthorized if session token is missing from request
      res.status(401).end();
      return
    }

    const sessionToken = authHeader.replace("Bearer ", "");

    if (!sessionToken) {
      // Unauthorized if session token is missing from request
      res.status(401).end();
      return
    }

    // gRPC call to session service to validate session
    sessionServiceGrpcClient.validateSession({ sessionToken }, (error, sessionValues) => {

      if (error) {
        console.error(error);
        res.status(401).end();
      }
      else {
        // Add session values to req object
        req.sessionValues = sessionValues;
        next();
      }

    });

  }
  catch (error) {
    console.error(error);
    res.status(500).end();
  }
}


module.exports = {
  verifySessionToken
};