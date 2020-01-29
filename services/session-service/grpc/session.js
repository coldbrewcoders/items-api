// Repository
const { signJwt, verifyJwt } = require("../repository/jwt");
const { getSessionToken, setSessionToken, removeSessionToken } = require("../repository/session_manager");


const validateSession = async (call, callback) => {
  const { sessionToken } = call.request;

  // Verify JWT is valid and return session values from token payload
  const sessionValues = verifyJwt(sessionToken);
  
  if (!sessionValues) {
    // If token is invalid, no session values are recieved
    callback("Invalid token", { userId: null, email: null, firstName: null, lastName: null, role: null });
  }
  else {
    // Get user id from session values
    const { userId } = sessionValues;

    // Get stored session token from redis
    const result = await getSessionToken(userId);

    if (!result) {
      // If no token found for user in redis, session has expired
      callback("Token has expired", { userId: null, email: null, firstName: null, lastName: null, role: null });
    }
    else if (result !== sessionToken) {
      // If redis token does not match passed token, remove it from redis
      await removeSessionToken(userId);

      // Return with an error and no session values
      callback("Tokens do not match for user", { userId: null, email: null, firstName: null, lastName: null, role: null });
    }
    else {
      // Re-add token to redis to reset expiration time
      await setSessionToken(userId, sessionToken);

      // Return session values
      callback(null, sessionValues);
    }
  }
}

const createSession = async (call, callback) => {
  const { userId, email, firstName, lastName, role } = call.request;

  // Create new signed JWT session token
  const sessionToken = signJwt(userId, email, firstName, lastName, role);

  // Check if token creation was successful
  if (!sessionToken) {
    // Failed to create toke, return error
    callback("Error creation JWT", { sessionToken: "" });
  }
  else {
    // Add session token to redis
    const result = await setSessionToken(userId, sessionToken);
    
    if (!result) {
      callback("Error adding session to Redis", { sessionToken: "" });
    }
    else { 
      // Return new JWT
      callback(null, { sessionToken });
    }
  }
}

const removeSession = async (call, callback) => {
  const { userId } = call.request;

  // Remove session from Redis
  const result = await removeSessionToken(userId);

  if (result === 1 || result === 0) {
    // Session removed from redis
    callback(null, { isRemoved: true });
  }
  else {
    callback("Error removing session to Redis", { isRemoved: false });
  }
}


module.exports = {
  validateSession,
  createSession,
  removeSession
};